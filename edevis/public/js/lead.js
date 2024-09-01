frappe.ui.form.on("Lead", {
  refresh: function (frm) {
    frm.trigger("setup_connections");
    //add connections for customer
  },
  setup_connections(frm) {
    //add connections for opportunity
    $('[class="document-link"][data-doctype="Opportunity"]').remove();
    if ($('.document-link-badge[data-doctype="Opportunity"]').length == 0) {
      frappe.db
        .get_list("Opportunity", {
          filters: {
            custom_lead: cur_frm.doc.name,
          },
          fields: ["name"],
        })
        .then((r) => {
          var opportunities = r.map(function (item) {
            return item["name"];
          });
          opportunities = [...new Set(opportunities)];
          if (!cur_frm.doc.lead_name) {
            opportunities = [];
          }
          if (opportunities.length > 0) {
            $('[class="document-link"][data-doctype="Prospect"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Opportunity"><div class="document-link-badge" data-doctype="Opportunity"><span class="count">${opportunities.length}</span><a class="badge-link" id="open-op">Opportunity</a></div></div>`
              );
          } else {
            $('[class="document-link"][data-doctype="Prospect"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Opportunity"><div class="document-link-badge" data-doctype="Opportunity"><a class="badge-link" id="open-op">Opportunity</a></div></div>`
              );
          }
          $("#open-op").click((r) => {
            frappe.set_route("List", "Opportunity", {
              name: ["in", opportunities],
            });
          });
          $(".form-documents *> button").hide();
          $(".open-notification").hide();
        });
    }

    //add connections for Customer
    $('[class="document-link"][data-doctype="Customer"]').remove();
    if ($('.document-link-badge[data-doctype="Customer"]').length == 0) {
      frappe.db
        .get_list("Customer", {
          filters: {
            lead_name: cur_frm.doc.name,
          },
          fields: ["name"],
        })
        .then((r) => {
          var customers = r.map(function (item) {
            return item["name"];
          });
          customers = [...new Set(customers)];

          if (!cur_frm.doc.name) {
            customers = [];
          }
          if (customers.length > 0) {
            $('[class="document-link"][data-doctype="Prospect"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Customer"><div class="document-link-badge" data-doctype="Customer"><span class="count">${customers.length}</span><a class="badge-link" id="open-cu">Customer</a></div></div>`
              );
          } else {
            $('[class="document-link"][data-doctype="Prospect"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Customer"><div class="document-link-badge" data-doctype="Customer"><a class="badge-link" id="open-cu">Customer</a></div></div>`
              );
          }
          $("#open-cu").click((r) => {
            frappe.set_route("List", "Customer", {
              name: ["in", customers],
            });
          });
          $(".form-documents *> button").hide();
          $(".open-notification").hide();
        });
    }
  },
});

frappe.ui.form.on("Lead", {
  //Remove option to generate Opportunity from Lead
  //Remove option to generate quote from Lead
  refresh(frm) {
    console.log("test");

    setTimeout(() => {
      frm.remove_custom_button("Opportunity", "Create");
      frm.remove_custom_button("Quotation", "Create");
      frm.remove_custom_button("Add to Prospect", "Action");
    }, 50);
  },
});

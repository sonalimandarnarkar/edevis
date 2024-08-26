frappe.ui.form.on("Lead", {
  refresh: function (frm) {
    //add connections for customer
    $('[class="document-link"][data-doctype="Customer"]').remove();
    if ($('.document-link-badge[data-doctype="Customer"]').length == 0) {
      frappe.db
        .get_list("Customer", {
          filters: {
            lead_name: frm.doc.name,
          },
          fields: ["name"],
        })
        .then((r) => {
          var customers = r.map(function (item) {
            return item["name"];
          });
          customers = [...new Set(customers)];

          if (customers.length > 0) {
            $(".form-documents >> .col-md-4")
              .first()
              .append(
                `<div class="document-link" data-doctype="Customer"><div class="document-link-badge" data-doctype="Customer"><span class="count">${customers.length}</span><a class="badge-link" id="open-cu">Customer</a></div></div>`
              );
          } else {
            $(".form-documents >> .col-md-4")
              .first()
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
    //add connections for opportunity
    $('[class="document-link"][data-doctype="Opportunity"]').remove();

    if ($('.document-link-badge[data-doctype="Opportunity"]').length == 0) {
      sbs = [];

      frappe.db
        .get_list("Customer", {
          filters: {
            lead_name: frm.doc.name,
          },
          fields: ["name"],
        })
        .then((cust_list) => {
          cust_list.forEach((item_sb) => {
            sbs.push(item_sb.name);
          });

          return frappe.db.get_list("Opportunity", {
            filters: {
              party_name: ["in", sbs],
            },
            fields: ["name"],
          });
        })
        .then((r) => {
          var opportunities = r.map(function (item) {
            return item["name"];
          });
          opportunities = [...new Set(opportunities)];

          console.log(opportunities);

          if (opportunities.length > 0) {
            $(".form-documents >> .col-md-4")
              .first()
              .append(
                `<div class="document-link" data-doctype="Opportunity"><div class="document-link-badge" data-doctype="Opportunity"><span class="count">${opportunities.length}</span><a class="badge-link" id="open-op">Opportunity</a></div></div>`
              );
          } else {
            $(".form-documents >> .col-md-4")
              .first()
              .append(
                `<div class="document-link" data-doctype="Opportunity"><div class="document-link-badge" data-doctype="Opportunity"><a class="badge-link" id="open-op">Opportunity</a></div></div>`
              );
          }

          $("#open-op").click(() => {
            frappe.set_route("List", "Opportunity", {
              name: ["in", opportunities],
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
    setTimeout(() => {
      frm.remove_custom_button("Opportunity", "Create");
      frm.remove_custom_button("Quotation", "Create");
    }, 10);
  },
});

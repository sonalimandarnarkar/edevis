frappe.ui.form.on("Opportunity", {
  refresh: function (frm) {
    frm.trigger("setup_connections");
  },
  validate: function (frm) {
    if (frm.doc.opportunity_from !== "Customer") {
      frappe.throw(
        "Please select 'Customer' as the Opportunity Form. Opportunities can only be created from a customer."
      );
    }
  },
  setup_connections(frm) {
    //add connections for Lead
    $('[class="document-link"][data-doctype="Supplier Quotation"]').remove();
    $('[class="document-link"][data-doctype="Request for Quotation"]').remove();
    $('[class="document-link"][data-doctype="Lead"]').remove();
    if ($('.document-link-badge[data-doctype="Lead"]').length == 0) {
      frappe.db
        .get_list("Lead", {
          filters: {
            name: cur_frm.doc.custom_lead,
          },
          fields: ["name"],
        })
        .then((r) => {
          var leads = r.map(function (item) {
            return item["name"];
          });
          leads = [...new Set(leads)];

          if (!cur_frm.doc.custom_lead) {
            leads = [];
          }
          if (leads.length > 0) {
            $('[class="document-link"][data-doctype="Quotation"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Lead"><div class="document-link-badge" data-doctype="Lead"><span class="count">${leads.length}</span><a class="badge-link" id="open-le">Lead</a></div></div>`
              );
          } else {
            $('[class="document-link"][data-doctype="Quotation"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Lead"><div class="document-link-badge" data-doctype="Lead"><a class="badge-link" id="open-le">Lead</a></div></div>`
              );
          }
          $("#open-le").click((r) => {
            frappe.set_route("List", "Lead", {
              name: ["in", leads],
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
            name: frm.doc.party_name,
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
            $('[class="document-link"][data-doctype="Quotation"]')
              .parent()
              .append(
                `<div class="document-link" data-doctype="Customer"><div class="document-link-badge" data-doctype="Customer"><span class="count">${customers.length}</span><a class="badge-link" id="open-cu">Customer</a></div></div>`
              );
          } else {
            $('[class="document-link"][data-doctype="Quotation"]')
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

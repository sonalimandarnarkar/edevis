frappe.ui.form.on("Opportunity", {
  refresh: function (frm) {
    // Ensure custom_lead is defined and has a value
    if (frm.doc.custom_lead) {
      frappe.call({
        method: "frappe.client.get_value",
        args: {
          doctype: "Lead",
          filters: { name: frm.doc.custom_lead },
          fieldname: "custom_test_problem",
        },
        callback: function (r) {
          if (r.message) {
            // Check if the field is present in the response
            const customTestProblem = r.message.custom_test_problem;
            if (customTestProblem) {
              frm.set_query("custom_test_problem", function () {
                return {
                  filters: {
                    name: customTestProblem,
                  },
                };
              });
            } else {
            }
          }
        },
      });
    } else {
      frm.set_query("custom_test_problem", function () {
        return {
          filters: {
            name: "",
          },
        };
      });
    }

    //add connections for customer
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

          if (customers.length > 0) {
            $(".form-documents >> .col-md-4")
              .first()
              .append(
                `<div class="document-link" data-doctype="Customer"><div class="document-link-badge" data-doctype="Lead"><span class="count">${customers.length}</span><a class="badge-link" id="open-cu">Customer</a></div></div>`
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

    //add connections for lead
    $('[class="document-link"][data-doctype="Lead"]').remove();
    if ($('.document-link-badge[data-doctype="Lead"]').length == 0) {
      frappe.db
        .get_list("Lead", {
          filters: {
            name: frm.doc.custom_lead,
          },
          fields: ["name"],
        })
        .then((r) => {
          var leads = r.map(function (item) {
            return item["name"];
          });
          leads = [...new Set(leads)];

          if (leads.length > 0) {
            $(".form-documents >> .col-md-4")
              .first()
              .append(
                `<div class="document-link" data-doctype="Lead"><div class="document-link-badge" data-doctype="Lead"><span class="count">${leads.length}</span><a class="badge-link" id="open-le">Lead</a></div></div>`
              );
          } else {
            $(".form-documents >> .col-md-4")
              .first()
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
  },
  validate: function (frm) {
    if (frm.doc.opportunity_from !== "Customer") {
      frappe.throw(
        "Please select 'Customer' as the Opportunity Form. Opportunities can only be created from a customer."
      );
    }
  },
});

frappe.ui.form.on("Customer", {
  refresh(frm) {
    frm.trigger("setup_opportunity_button");

    //add connections for lead
    $('[class="document-link"][data-doctype="Lead"]').remove();
    if ($('.document-link-badge[data-doctype="Lead"]').length == 0) {
      frappe.db
        .get_list("Lead", {
          filters: {
            name: frm.doc.lead_name,
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

  setup_opportunity_button(frm) {
    frm
      .add_custom_button(
        __("Opportunity"),
        () => {
          frm.trigger("create_opportunity");
        },
        __("Create")
      )
      .addClass("btn-primary");
  },

  create_opportunity(frm) {
    frappe.model.open_mapped_doc({
      method: "edevis.custom_scripts.custom_python.customer.create_opportunity",
      frm: frm,
    });
  },
});

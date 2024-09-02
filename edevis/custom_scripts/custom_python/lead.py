import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def create_customer(source_name, target_doc=None):
	def postprocess(source, doc):
		pass

	doc = get_mapped_doc(
		"Lead",
		source_name,
		{
			"Lead": {
				"doctype": "Customer",
				"validation": {
					
				},
				"field_map": {
					"lead_name": "customer_name",
					"name": "lead_name",
					"Individual": "customer_type"
				},
			},
			
		},
		target_doc,
		postprocess
	)

	return doc
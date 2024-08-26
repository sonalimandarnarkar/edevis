import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def create_opportunity(source_name, target_doc=None):
	def postprocess(source, doc):
		pass

	doc = get_mapped_doc(
		"Customer",
		source_name,
		{
			"Customer": {
				"doctype": "Opportunity",
				"validation": {
					
				},
				"field_map": {
					"doctype": "opportunity_from",
					"name": "party_name",
					"Open": "status",
					"lead_name":"custom_lead",
				},
			},
			
		},
		target_doc,
		postprocess
	)

	return doc
import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def execute():
	frappe.reload_doc("CRM", "doctype", "lead")
	frappe.reload_doc("Edevis", "doctype", "Pruefproblem")
	frappe.reload_doc("CRM", "doctype", "Opportunity")
	
	make_property_setter("Lead", "custom_test_problem", "reqd", 1, "Check")
	make_property_setter("Lead", "custom_inquiry_description_details", "hidden", 1, "Check")
	make_property_setter("Opportunity", "custom_test_problem", "fetch_from", "custom_lead.custom_test_problem", "Text")
	make_property_setter("Opportunity", "custom_test_problem", "fetch_if_empty", 1, "Check")
	create_custom_field("Pruefproblem",
	dict(fieldname="custom_inquiry_description_details", label="Inquiry Description Details",
	fieldtype="Long Text", insert_before="examination_edevis_section"))
	
	
	

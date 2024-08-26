from frappe.model.document import Document
import frappe

@frappe.whitelist()
def fetch_lead(doc,method=None):
    doc.custom_lead = frappe.db.get_value("Customer",doc.party_name,'lead_name')


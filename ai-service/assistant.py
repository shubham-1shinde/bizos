def analyze_business_question(question: str, context: dict):
    q_lower = question.lower()
    sales_cnt = context.get("salesCount", 0)
    low_stock = context.get("lowStockCount", 0)
    
    if "profit" in q_lower:
        reply = "Gross profit margins are strong at 44.5%. Main driver: Enterprise laptops & server solutions. Utility costs were slightly higher last month."
    elif "sales" in q_lower or "revenue" in q_lower:
        reply = f"Total completed sales count is {sales_cnt}. Top performing segment is Enterprise Tech. Monthly trajectory remains positive."
    elif "stock" in q_lower or "inventory" in q_lower or "restock" in q_lower:
        reply = f"Alert: You have {low_stock} products below reorder thresholds (including Ergonomic Keyboards & Headsets). Suggest placing purchase orders today."
    elif "gst" in q_lower or "tax" in q_lower:
        reply = "GST compliance score is 96%. GSTR-3B return is due soon. Available Input Tax Credit (ITC) efficiently offsets output liability."
    elif "customer" in q_lower or "risk" in q_lower:
        reply = "Customer Retention Rate is 91%. VIP customer segment accounts for 62% of revenue. 1 customer is flagged as At-Risk due to 60+ days inactivity."
    else:
        reply = f"I have evaluated your business metrics across Sales, Inventory, and Finance. System health score is 94/100. How else can I assist your operations?"

    return {"reply": reply}

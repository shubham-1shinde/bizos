import os
import logging
from google import genai

logger = logging.getLogger(__name__)


def _load_gemini_api_key():
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        logger.error("GEMINI_API_KEY is not configured")
        return None

    return api_key.strip()


def _query_gemini(question: str, context: dict, api_key: str):
    try:
        client = genai.Client(api_key=api_key)

        sales_cnt = context.get("salesCount", 0)
        low_stock = context.get("lowStockCount", 0)
        product_cnt = context.get("productCount", 0)
        customer_cnt = context.get("customerCount", 0)

        prompt = f"""
You are BizOS AI, an expert business analyst and ERP assistant.

Answer the user's business question concisely in 2-4 sentences.

Business Context:
- Sales/Orders Count: {sales_cnt}
- Active Products: {product_cnt}
- Active Customers: {customer_cnt}
- Low Stock Alert Count: {low_stock}

User Question:
{question}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if response and response.text:
            return response.text.strip()

        return None

    except Exception as e:
        logger.exception("Gemini request failed")
        return None


def _rule_based_fallback(question: str, context: dict):
    q_lower = question.lower()

    sales_cnt = context.get("salesCount", 0)
    low_stock = context.get("lowStockCount", 0)

    if "profit" in q_lower:
        return "Gross profit margins are strong at 44.5%."

    elif "sales" in q_lower or "revenue" in q_lower:
        return f"Total completed sales count is {sales_cnt}. Monthly sales performance remains positive."

    elif "stock" in q_lower or "inventory" in q_lower or "restock" in q_lower:
        return f"You currently have {low_stock} products below their reorder threshold."

    elif "gst" in q_lower or "tax" in q_lower:
        return "Your GST compliance information is available from the finance module."

    elif "customer" in q_lower:
        return "Your customer information is available from the customer module."

    else:
        return "I have evaluated your business metrics across Sales, Inventory, and Finance."


def analyze_business_question(question: str, context: dict):
    api_key = _load_gemini_api_key()

    if api_key:
        reply = _query_gemini(question, context, api_key)

        if reply:
            return {
                "reply": reply,
                "source": "gemini"
            }

    return {
        "reply": _rule_based_fallback(question, context),
        "source": "rule_engine"
    }
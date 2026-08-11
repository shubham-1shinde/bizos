from typing import Any, Dict


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def _safe_float(value: Any, default: float = 0.0) -> float:
    """Safely converts a value to float."""

    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def _safe_int(value: Any, default: int = 0) -> int:
    """Safely converts a value to integer."""

    try:
        return int(value)
    except (ValueError, TypeError):
        return default


def _clamp(value: float, minimum: float, maximum: float) -> float:
    """Keeps a value within a defined range."""

    return max(
        minimum,
        min(
            maximum,
            value
        )
    )


# ============================================================
# PRICE CHANGE SIMULATION
# ============================================================

def _simulate_price_change(parameters: Dict[str, Any]) -> Dict[str, Any]:

    price_change = _safe_float(
        parameters.get(
            "priceChangePct",
            10
        ),
        10
    )

    # Keep simulation within reasonable range
    price_change = _clamp(
        price_change,
        -50,
        100
    )

    # Basic elasticity assumption:
    # Price increase → demand decreases
    demand_elasticity = 0.30

    demand_impact = round(
        -price_change * demand_elasticity,
        1
    )

    revenue_impact = round(
        price_change + demand_impact,
        1
    )

    # Estimated profit impact
    profit_impact = round(
        revenue_impact * 1.4,
        1
    )

    cost_impact = 0.0

    if price_change > 0:

        recommendation = (
            f"Increasing price by {price_change}% "
            f"could improve revenue by approximately "
            f"{revenue_impact}%. However, estimated demand "
            f"may change by {demand_impact}%. "
            f"Review customer price sensitivity before implementation."
        )

    elif price_change < 0:

        recommendation = (
            f"Reducing price by {abs(price_change)}% "
            f"may increase demand, but could reduce "
            f"profitability. Monitor margins before applying "
            f"the change across all products."
        )

    else:

        recommendation = (
            "No price change was applied. "
            "Current pricing strategy remains unchanged."
        )

    return {
        "revenueImpact": revenue_impact,
        "profitImpact": profit_impact,
        "demandImpact": demand_impact,
        "costImpact": cost_impact,
        "recommendation": recommendation
    }


# ============================================================
# HIRING SIMULATION
# ============================================================

def _simulate_hiring(parameters: Dict[str, Any]) -> Dict[str, Any]:

    employee_count = _safe_int(
        parameters.get(
            "employeeCount",
            2
        ),
        2
    )

    employee_count = max(
        1,
        min(
            employee_count,
            100
        )
    )

    # Estimated percentage impact per employee
    cost_per_employee = 12.5
    revenue_per_employee = 16.0
    demand_per_employee = 5.0

    cost_impact = round(
        employee_count * cost_per_employee,
        1
    )

    revenue_impact = round(
        employee_count * revenue_per_employee,
        1
    )

    demand_impact = round(
        employee_count * demand_per_employee,
        1
    )

    profit_impact = round(
        revenue_impact - cost_impact,
        1
    )

    recommendation = (
        f"Hiring {employee_count} additional employee"
        f"{'s' if employee_count != 1 else ''} "
        f"could increase operational capacity and "
        f"potential revenue. Estimated revenue impact is "
        f"{revenue_impact}%, with an estimated cost impact "
        f"of {cost_impact}%."
    )

    return {
        "revenueImpact": revenue_impact,
        "profitImpact": profit_impact,
        "demandImpact": demand_impact,
        "costImpact": cost_impact,
        "recommendation": recommendation
    }


# ============================================================
# MARKETING SIMULATION
# ============================================================

def _simulate_marketing(parameters: Dict[str, Any]) -> Dict[str, Any]:

    marketing_change = _safe_float(
        parameters.get(
            "marketingIncreasePct",
            20
        ),
        20
    )

    marketing_change = _clamp(
        marketing_change,
        0,
        200
    )

    # Estimated relationships
    revenue_multiplier = 1.125
    demand_multiplier = 1.25
    cost_ratio = 0.70

    revenue_impact = round(
        marketing_change * revenue_multiplier,
        1
    )

    demand_impact = round(
        marketing_change * demand_multiplier,
        1
    )

    cost_impact = round(
        marketing_change * cost_ratio,
        1
    )

    profit_impact = round(
        revenue_impact - cost_impact,
        1
    )

    recommendation = (
        f"Increasing marketing investment by "
        f"{marketing_change}% could improve customer "
        f"acquisition and demand. Estimated revenue impact "
        f"is {revenue_impact}%, while estimated additional "
        f"cost impact is {cost_impact}%."
    )

    return {
        "revenueImpact": revenue_impact,
        "profitImpact": profit_impact,
        "demandImpact": demand_impact,
        "costImpact": cost_impact,
        "recommendation": recommendation
    }


# ============================================================
# WAREHOUSE SIMULATION
# ============================================================

def _simulate_warehouse(parameters: Dict[str, Any]) -> Dict[str, Any]:

    warehouse_count = _safe_int(
        parameters.get(
            "warehouseCount",
            1
        ),
        1
    )

    warehouse_count = max(
        1,
        min(
            warehouse_count,
            20
        )
    )

    cost_impact = round(
        warehouse_count * 8.0,
        1
    )

    revenue_impact = round(
        warehouse_count * 10.0,
        1
    )

    demand_impact = round(
        warehouse_count * 6.0,
        1
    )

    profit_impact = round(
        revenue_impact - cost_impact,
        1
    )

    recommendation = (
        f"Adding {warehouse_count} warehouse"
        f"{'s' if warehouse_count != 1 else ''} "
        f"could improve distribution capacity and "
        f"regional availability. Evaluate logistics cost "
        f"and expected sales growth before implementation."
    )

    return {
        "revenueImpact": revenue_impact,
        "profitImpact": profit_impact,
        "demandImpact": demand_impact,
        "costImpact": cost_impact,
        "recommendation": recommendation
    }


# ============================================================
# PRODUCT LAUNCH SIMULATION
# ============================================================

def _simulate_product_launch(parameters: Dict[str, Any]) -> Dict[str, Any]:

    expected_sales = _safe_float(
        parameters.get(
            "expectedSalesPct",
            15
        ),
        15
    )

    expected_sales = _clamp(
        expected_sales,
        1,
        200
    )

    revenue_impact = round(
        expected_sales,
        1
    )

    demand_impact = round(
        expected_sales * 1.15,
        1
    )

    cost_impact = round(
        expected_sales * 0.45,
        1
    )

    profit_impact = round(
        revenue_impact - cost_impact,
        1
    )

    recommendation = (
        "The product launch shows potential for positive "
        "revenue and demand growth. Validate market demand "
        "and initial launch costs before scaling."
    )

    return {
        "revenueImpact": revenue_impact,
        "profitImpact": profit_impact,
        "demandImpact": demand_impact,
        "costImpact": cost_impact,
        "recommendation": recommendation
    }


# ============================================================
# MAIN WHAT-IF SIMULATION
# ============================================================

def run_what_if_simulation(
    scenario_type: str,
    parameters: Dict[str, Any] | None = None
) -> Dict[str, Any]:

    parameters = parameters or {}

    scenario = (
        str(
            scenario_type or ""
        )
        .upper()
        .strip()
    )

    # --------------------------------------------------------
    # Scenario selection
    # --------------------------------------------------------

    if scenario == "PRICE_CHANGE":

        result = _simulate_price_change(
            parameters
        )

    elif scenario == "HIRE_EMPLOYEES":

        result = _simulate_hiring(
            parameters
        )

    elif scenario == "MARKETING_BOOST":

        result = _simulate_marketing(
            parameters
        )

    elif scenario == "ADD_WAREHOUSE":

        result = _simulate_warehouse(
            parameters
        )

    elif scenario == "LAUNCH_PRODUCT":

        result = _simulate_product_launch(
            parameters
        )

    else:

        return {
            "success": False,
            "scenarioType": scenario,
            "parameters": parameters,
            "error": (
                f"Unsupported scenario type: {scenario}. "
                "Supported scenarios are PRICE_CHANGE, "
                "HIRE_EMPLOYEES, MARKETING_BOOST, "
                "ADD_WAREHOUSE and LAUNCH_PRODUCT."
            )
        }

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {

        "success": True,

        "scenarioType": scenario,

        "parameters": parameters,

        "results": {

            "revenueImpact": result[
                "revenueImpact"
            ],

            "profitImpact": result[
                "profitImpact"
            ],

            "demandImpact": result[
                "demandImpact"
            ],

            "costImpact": result[
                "costImpact"
            ]
        },

        "recommendation": result[
            "recommendation"
        ]
    }
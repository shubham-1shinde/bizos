def run_what_if_simulation(scenario_type: str, parameters: dict):
    param_pct = parameters.get("priceChangePct", 10) if parameters else 10
    
    if scenario_type == "PRICE_CHANGE":
        revenue_impact = round(param_pct * 0.9, 1)
        profit_impact = round(param_pct * 1.4, 1)
        demand_impact = round(-param_pct * 0.3, 1)
        cost_impact = 0.0
        recommendation = f"Increasing price by {param_pct}% projects a net profit gain of {profit_impact}% with minimal volume loss ({demand_impact}%)."
    elif scenario_type == "HIRE_EMPLOYEES":
        count = parameters.get("employeeCount", 2) if parameters else 2
        cost_impact = round(count * 12.5, 1)
        revenue_impact = round(count * 16.0, 1)
        profit_impact = round(revenue_impact - cost_impact, 1)
        demand_impact = round(count * 5.0, 1)
        recommendation = f"Hiring {count} sales representatives expands pipeline capacity, generating positive net profit ROI."
    elif scenario_type == "MARKETING_BOOST":
        revenue_impact = 22.5
        profit_impact = 11.2
        demand_impact = 25.0
        cost_impact = 14.0
        recommendation = "Expanding targeted marketing spend drives customer acquisition and top-line growth."
    else:
        revenue_impact = 12.0
        profit_impact = 15.0
        demand_impact = 8.0
        cost_impact = 4.0
        recommendation = "Simulation outcome indicates favorable operational outcome."

    return {
        "scenarioType": scenario_type,
        "parameters": parameters,
        "results": {
            "revenueImpact": revenue_impact,
            "profitImpact": profit_impact,
            "demandImpact": demand_impact,
            "costImpact": cost_impact
        },
        "recommendation": recommendation
    }

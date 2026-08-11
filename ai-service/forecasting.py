from datetime import datetime
from typing import Any, Dict, List, Optional
import hashlib

import numpy as np
from sklearn.linear_model import LinearRegression


# ============================================================
# DYNAMIC MONTH GENERATOR
# ============================================================

def _get_dynamic_months(count: int = 12, start_offset: int = -6) -> List[str]:
    """
    Generates month names dynamically relative to the current month.
    Example:
    Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb...
    """

    now = datetime.now()

    months = []

    # Convert current month into a zero-based index
    start_index = (now.month - 1) + start_offset

    for i in range(count):
        month_index = (start_index + i) % 12

        # Use a fixed leap-safe date only for getting month names
        month_name = datetime(2000, month_index + 1, 1).strftime("%b")

        months.append(month_name)

    return months


# ============================================================
# FORECAST PERIOD PARSER
# ============================================================

def _parse_period_length(period: str) -> int:
    """
    Extracts forecast duration from strings such as:
    Next 3 Months
    Next 6 Months
    Next 9 Months
    Next 12 Months
    """

    if not period:
        return 6

    period_lower = str(period).lower()

    if "12" in period_lower or "year" in period_lower or "annual" in period_lower:
        return 12

    if "9" in period_lower:
        return 9

    if "3" in period_lower or "quarter" in period_lower:
        return 3

    if "6" in period_lower:
        return 6

    return 6


# ============================================================
# SYNTHETIC HISTORICAL DATA
# ============================================================

def _generate_synthetic_historical(
    forecast_type: str,
    company_id: Optional[str],
    length: int = 6
) -> np.ndarray:
    """
    Generates deterministic synthetic historical data.

    Used only when real historical data is unavailable.
    """

    seed_string = f"{str(forecast_type).upper()}-{company_id or 'DEFAULT'}"

    seed = int(
        hashlib.md5(seed_string.encode()).hexdigest()[:8],
        16
    ) % 10000

    rng = np.random.RandomState(seed)

    forecast_type = (forecast_type or "REVENUE").upper()

    if "EXPENSE" in forecast_type or "COST" in forecast_type:

        base = 180000 + (seed % 70000)
        growth_step = 6000 + (seed % 4000)
        noise_scale = 8000

    elif (
        "UNITS" in forecast_type
        or "QTY" in forecast_type
        or "VOLUME" in forecast_type
    ):

        base = 1200 + (seed % 800)
        growth_step = 80 + (seed % 60)
        noise_scale = 50

    elif "PROFIT" in forecast_type:

        base = 220000 + (seed % 90000)
        growth_step = 12000 + (seed % 8000)
        noise_scale = 12000

    elif "CUSTOMER" in forecast_type or "USER" in forecast_type:

        base = 350 + (seed % 200)
        growth_step = 25 + (seed % 15)
        noise_scale = 15

    else:
        # Revenue / Sales
        base = 420000 + (seed % 150000)
        growth_step = 25000 + (seed % 15000)
        noise_scale = 18000

    x = np.arange(1, length + 1)

    noise = rng.normal(
        0,
        noise_scale,
        size=length
    )

    y = base + (x * growth_step) + noise

    # Prevent unrealistic negative values
    y = np.maximum(
        y,
        base * 0.5
    )

    return np.round(y, 2)


# ============================================================
# FORECAST GENERATOR
# ============================================================

def generate_forecast(
    forecast_type: str = "REVENUE",
    period: str = "Next 6 Months",
    company_id: Optional[str] = None,
    historical_data: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Generates a future forecast using Linear Regression.

    Priority:
    1. Real historical_data if provided.
    2. Synthetic data for demo/testing if historical_data is unavailable.
    """

    # --------------------------------------------------------
    # 1. Determine forecast duration
    # --------------------------------------------------------

    forecast_count = _parse_period_length(period)

    # Need enough historical points to create a meaningful trend
    hist_count = max(6, forecast_count)

    # --------------------------------------------------------
    # 2. Get historical data
    # --------------------------------------------------------

    if historical_data and len(historical_data) >= 3:

        # Convert to numeric values
        y_hist = np.array(
            historical_data,
            dtype=float
        )

        # Remove invalid values
        y_hist = y_hist[
            np.isfinite(y_hist)
        ]

        if len(y_hist) < 3:
            y_hist = _generate_synthetic_historical(
                forecast_type,
                company_id,
                hist_count
            )

    else:

        y_hist = _generate_synthetic_historical(
            forecast_type,
            company_id,
            hist_count
        )

    hist_count = len(y_hist)

    # --------------------------------------------------------
    # 3. Generate month labels
    # --------------------------------------------------------

    all_months = _get_dynamic_months(
        count=hist_count + forecast_count,
        start_offset=-hist_count
    )

    hist_months = all_months[:hist_count]

    future_months = all_months[
        hist_count:hist_count + forecast_count
    ]

    # --------------------------------------------------------
    # 4. Prepare training data
    # --------------------------------------------------------

    X_hist = np.arange(
        1,
        hist_count + 1
    ).reshape(-1, 1)

    model = LinearRegression()

    model.fit(
        X_hist,
        y_hist
    )

    # --------------------------------------------------------
    # 5. Predict future
    # --------------------------------------------------------

    X_future = np.arange(
        hist_count + 1,
        hist_count + forecast_count + 1
    ).reshape(-1, 1)

    y_future_pred = model.predict(
        X_future
    )

    # Prevent negative predictions
    y_future_pred = np.maximum(
        y_future_pred,
        0
    )

    # --------------------------------------------------------
    # 6. Model metrics
    # --------------------------------------------------------

    r2 = float(
        model.score(
            X_hist,
            y_hist
        )
    )

    # R² can be negative for poor models
    model_fit_score = round(
        max(0.0, min(1.0, r2)) * 100,
        1
    )

    # --------------------------------------------------------
    # 7. Growth calculation
    # --------------------------------------------------------

    historical_start = float(
        y_hist[0]
    )

    future_end = float(
        y_future_pred[-1]
    )

    if historical_start > 0:

        growth_rate = round(
            (
                (future_end - historical_start)
                / historical_start
            ) * 100,
            1
        )

    else:

        growth_rate = 0.0

    # --------------------------------------------------------
    # 8. Trend calculation
    # --------------------------------------------------------

    slope = float(
        model.coef_[0]
    )

    if slope > 0:

        trend = "Increasing"

    elif slope < 0:

        trend = "Decreasing"

    else:

        trend = "Stable"

    # --------------------------------------------------------
    # 9. Historical predictions
    # --------------------------------------------------------

    predictions = []

    for idx, month in enumerate(hist_months):

        actual_value = int(
            round(
                float(y_hist[idx])
            )
        )

        predictions.append({
            "month": month,
            "actual": actual_value,
            "forecast": actual_value,
            "type": "historical"
        })

    # --------------------------------------------------------
    # 10. Future predictions
    # --------------------------------------------------------

    for idx, month in enumerate(future_months):

        forecast_value = int(
            round(
                float(y_future_pred[idx])
            )
        )

        predictions.append({
            "month": month,
            "actual": None,
            "forecast": forecast_value,
            "type": "forecast"
        })

    # --------------------------------------------------------
    # 11. Forecast total
    # --------------------------------------------------------

    predicted_total = int(
        round(
            float(
                np.sum(
                    y_future_pred
                )
            )
        )
    )

    # --------------------------------------------------------
    # 12. Explanation
    # --------------------------------------------------------

    explanation = (
        f"Linear Regression model fitted to "
        f"{hist_count} historical data points. "
        f"The model shows an {trend.lower()} trend "
        f"for {forecast_type.lower()} with an estimated "
        f"{growth_rate}% change over {period.lower()}."
    )

    # --------------------------------------------------------
    # 13. Final response
    # --------------------------------------------------------

    return {

        "type": forecast_type,

        "period": period,

        "model": "Linear Regression",

        "modelFitScore": model_fit_score,

        "trend": trend,

        "explanation": explanation,

        "predictions": predictions,

        "metrics": {

            "predictedTotal": predicted_total,

            "growthRate": growth_rate,

            "trendSlope": round(
                slope,
                2
            ),

            "historicalAverage": round(
                float(
                    np.mean(y_hist)
                ),
                2
            ),

            "forecastAverage": round(
                float(
                    np.mean(y_future_pred)
                ),
                2
            )
        }
    }


# ============================================================
# INVENTORY RISK / DEMAND SCORE
# ============================================================

def predict_demand_scores(
    product_data: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Calculates inventory risk scores and recommended order quantities.

    NOTE:
    This is a rule-based inventory risk engine,
    not an ML demand prediction model.
    """

    results = []

    if not product_data or not isinstance(
        product_data,
        list
    ):
        return results

    for item in product_data:

        try:

            stock = float(
                item.get(
                    "stock",
                    0
                )
            )

            reorder = float(
                item.get(
                    "reorder",
                    10
                )
            )

        except (
            ValueError,
            TypeError
        ):

            stock = 0
            reorder = 10

        # Prevent invalid reorder values
        if reorder <= 0:
            reorder = 10

        stock_ratio = (
            stock / reorder
        )

        # ----------------------------------------------------
        # Critical stock
        # ----------------------------------------------------

        if stock_ratio <= 0.5:

            demand_score = int(
                min(
                    99,
                    90 + (
                        1.0 - stock_ratio
                    ) * 10
                )
            )

            prediction = (
                "Critical Stockout Risk"
            )

            suggested_qty = max(
                0,
                int(
                    round(
                        (reorder * 3)
                        - stock
                    )
                )
            )

        # ----------------------------------------------------
        # Low stock
        # ----------------------------------------------------

        elif stock_ratio <= 1.0:

            demand_score = int(
                min(
                    89,
                    70 + (
                        1.0 - stock_ratio
                    ) * 20
                )
            )

            prediction = (
                "Moderate Low Stock Alert"
            )

            suggested_qty = max(
                0,
                int(
                    round(
                        (reorder * 2.5)
                        - stock
                    )
                )
            )

        # ----------------------------------------------------
        # Optimal stock
        # ----------------------------------------------------

        elif stock_ratio <= 2.5:

            demand_score = int(
                max(
                    30,
                    min(
                        69,
                        50 - (
                            stock_ratio - 1.0
                        ) * 10
                    )
                )
            )

            prediction = (
                "Optimal Inventory Level"
            )

            suggested_qty = 0

        # ----------------------------------------------------
        # Overstock
        # ----------------------------------------------------

        else:

            demand_score = int(
                max(
                    10,
                    25 - (
                        stock_ratio - 2.5
                    ) * 5
                )
            )

            prediction = (
                "Overstock Warning"
            )

            suggested_qty = 0

        # ----------------------------------------------------
        # Store result
        # ----------------------------------------------------

        results.append({

            "sku": item.get(
                "sku",
                "SKU-UNKNOWN"
            ),

            "demandScore": demand_score,

            "prediction": prediction,

            "suggestedOrderQty": suggested_qty,

            "currentStock": int(
                round(stock)
            ),

            "reorderLevel": int(
                round(reorder)
            ),

            "stockRatio": round(
                stock_ratio,
                2
            )
        })

    return results
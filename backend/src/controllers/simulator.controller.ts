import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middlewares/auth';
import { env } from '../config/env';
import { Simulation } from '../models';

interface SimulationParameters {
  priceChangePct?: number;
  employeeCount?: number;
  marketingIncreasePct?: number;
  warehouseCount?: number;
  expectedSalesPct?: number;
}

interface SimulationResult {
  success: boolean;
  scenarioType: string;
  parameters: SimulationParameters;
  results: {
    revenueImpact: number;
    profitImpact: number;
    demandImpact: number;
    costImpact: number;
  };
  recommendation: string;
}

// ============================================================
// HELPERS
// ============================================================

const safeNumber = (
  value: unknown,
  defaultValue = 0
): number => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : defaultValue;
};

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.max(min, Math.min(max, value));
};

// ============================================================
// FALLBACK SIMULATION ENGINE
// ============================================================

const runFallbackSimulation = (
  scenarioType: string,
  parameters: SimulationParameters
): SimulationResult => {

  const scenario = scenarioType
    .toUpperCase()
    .trim();

  let revenueImpact = 0;
  let profitImpact = 0;
  let demandImpact = 0;
  let costImpact = 0;
  let recommendation = '';

  // ==========================================================
  // PRICE CHANGE
  // ==========================================================

  if (scenario === 'PRICE_CHANGE') {

    let priceChange = safeNumber(
      parameters.priceChangePct,
      10
    );

    priceChange = clamp(
      priceChange,
      -50,
      100
    );

    const elasticity = 0.3;

    demandImpact = Number(
      (-priceChange * elasticity).toFixed(1)
    );

    revenueImpact = Number(
      (priceChange + demandImpact).toFixed(1)
    );

    profitImpact = Number(
      (revenueImpact * 1.4).toFixed(1)
    );

    costImpact = 0;

    if (priceChange > 0) {

      recommendation =
        `Increasing price by ${priceChange}% could improve ` +
        `revenue by approximately ${revenueImpact}%. ` +
        `Estimated demand impact is ${demandImpact}%. ` +
        `Review customer price sensitivity before implementation.`;

    } else if (priceChange < 0) {

      recommendation =
        `Reducing price by ${Math.abs(priceChange)}% may increase ` +
        `demand but can reduce profitability. Monitor margins ` +
        `before applying the change broadly.`;

    } else {

      recommendation =
        'No price change was applied.';
    }
  }

  // ==========================================================
  // HIRE EMPLOYEES
  // ==========================================================

  else if (scenario === 'HIRE_EMPLOYEES') {

    let employeeCount = safeNumber(
      parameters.employeeCount,
      2
    );

    employeeCount = Math.round(
      clamp(
        employeeCount,
        1,
        100
      )
    );

    const costPerEmployee = 12.5;
    const revenuePerEmployee = 16;
    const demandPerEmployee = 5;

    costImpact = Number(
      (employeeCount * costPerEmployee).toFixed(1)
    );

    revenueImpact = Number(
      (employeeCount * revenuePerEmployee).toFixed(1)
    );

    demandImpact = Number(
      (employeeCount * demandPerEmployee).toFixed(1)
    );

    profitImpact = Number(
      (revenueImpact - costImpact).toFixed(1)
    );

    recommendation =
      `Hiring ${employeeCount} additional employee` +
      `${employeeCount !== 1 ? 's' : ''} could increase ` +
      `operational capacity and potential revenue. ` +
      `Estimated revenue impact is ${revenueImpact}%, ` +
      `with an estimated cost impact of ${costImpact}%.`;
  }

  // ==========================================================
  // MARKETING BOOST
  // ==========================================================

  else if (scenario === 'MARKETING_BOOST') {

    let marketingIncrease = safeNumber(
      parameters.marketingIncreasePct,
      20
    );

    marketingIncrease = clamp(
      marketingIncrease,
      0,
      200
    );

    const revenueMultiplier = 1.125;
    const demandMultiplier = 1.25;
    const costRatio = 0.70;

    revenueImpact = Number(
      (marketingIncrease * revenueMultiplier).toFixed(1)
    );

    demandImpact = Number(
      (marketingIncrease * demandMultiplier).toFixed(1)
    );

    costImpact = Number(
      (marketingIncrease * costRatio).toFixed(1)
    );

    profitImpact = Number(
      (revenueImpact - costImpact).toFixed(1)
    );

    recommendation =
      `Increasing marketing investment by ${marketingIncrease}% ` +
      `could improve customer acquisition and demand. ` +
      `Estimated revenue impact is ${revenueImpact}%, while ` +
      `estimated additional cost impact is ${costImpact}%.`;
  }

  // ==========================================================
  // ADD WAREHOUSE
  // ==========================================================

  else if (scenario === 'ADD_WAREHOUSE') {

    let warehouseCount = safeNumber(
      parameters.warehouseCount,
      1
    );

    warehouseCount = Math.round(
      clamp(
        warehouseCount,
        1,
        20
      )
    );

    costImpact = Number(
      (warehouseCount * 8).toFixed(1)
    );

    revenueImpact = Number(
      (warehouseCount * 10).toFixed(1)
    );

    demandImpact = Number(
      (warehouseCount * 6).toFixed(1)
    );

    profitImpact = Number(
      (revenueImpact - costImpact).toFixed(1)
    );

    recommendation =
      `Adding ${warehouseCount} warehouse` +
      `${warehouseCount !== 1 ? 's' : ''} could improve ` +
      `distribution capacity and regional availability. ` +
      `Evaluate logistics costs and expected sales growth ` +
      `before implementation.`;
  }

  // ==========================================================
  // LAUNCH PRODUCT
  // ==========================================================

  else if (scenario === 'LAUNCH_PRODUCT') {

    let expectedSales = safeNumber(
      parameters.expectedSalesPct,
      15
    );

    expectedSales = clamp(
      expectedSales,
      1,
      200
    );

    revenueImpact = Number(
      expectedSales.toFixed(1)
    );

    demandImpact = Number(
      (expectedSales * 1.15).toFixed(1)
    );

    costImpact = Number(
      (expectedSales * 0.45).toFixed(1)
    );

    profitImpact = Number(
      (revenueImpact - costImpact).toFixed(1)
    );

    recommendation =
      'The product launch shows potential for positive ' +
      'revenue and demand growth. Validate market demand ' +
      'and initial launch costs before scaling.';
  }

  // ==========================================================
  // INVALID SCENARIO
  // ==========================================================

  else {

    throw new Error(
      `Unsupported scenario type: ${scenario}. ` +
      `Supported scenarios: PRICE_CHANGE, ` +
      `HIRE_EMPLOYEES, MARKETING_BOOST, ` +
      `ADD_WAREHOUSE, LAUNCH_PRODUCT`
    );
  }

  return {
    success: true,

    scenarioType: scenario,

    parameters,

    results: {
      revenueImpact,
      profitImpact,
      demandImpact,
      costImpact
    },

    recommendation
  };
};

// ============================================================
// MAIN CONTROLLER
// ============================================================

export const runSimulation = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const {
      scenarioType,
      parameters = {}
    } = req.body;

    const companyId = req.companyId;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!companyId) {
      return res.status(401).json({
        error: 'Company authentication required'
      });
    }

    if (!scenarioType) {
      return res.status(400).json({
        error: 'Scenario type is required'
      });
    }

    if (
      typeof parameters !== 'object' ||
      Array.isArray(parameters)
    ) {
      return res.status(400).json({
        error: 'Parameters must be an object'
      });
    }

    const normalizedScenario = String(
      scenarioType
    )
      .toUpperCase()
      .trim();

    // --------------------------------------------------------
    // Try Python AI/ML service first
    // --------------------------------------------------------

    let simulationResult: SimulationResult;

    try {

      const response = await axios.post(
        `${env.AI_SERVICE_URL}/simulate`,
        {
          scenarioType: normalizedScenario,
          parameters,
          companyId
        },
        {
          timeout: 10000
        }
      );

      simulationResult = response.data;

      // Make sure Python response is valid
      if (
        !simulationResult ||
        !simulationResult.results
      ) {
        throw new Error(
          'Invalid response from AI service'
        );
      }

    } catch (aiError) {

      console.warn(
        'AI simulation service unavailable. Using local fallback engine.'
      );

      // ------------------------------------------------------
      // Local fallback
      // ------------------------------------------------------

      simulationResult =
        runFallbackSimulation(
          normalizedScenario,
          parameters
        );
    }

    // --------------------------------------------------------
    // Store simulation
    // --------------------------------------------------------

    await Simulation.create({

      companyId,

      scenarioType:
        normalizedScenario,

      parameters,

      results:
        simulationResult.results,

      recommendation:
        simulationResult.recommendation
    });

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(200).json(
      simulationResult
    );

  } catch (error: any) {

    console.error(
      'Simulation error:',
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Failed to run simulation'
    });
  }
};
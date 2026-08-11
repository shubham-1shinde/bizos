import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, Company, CompanyUser } from '../models';
import { AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, companyName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'Owner',
    });

    let company = null;
    if (companyName) {
      company = await Company.create({
        name: companyName,
        onboardingCompleted: false,
      });

      await CompanyUser.create({
        companyId: company._id,
        userId: user._id,
        role: 'Owner',
      });

      user.currentCompanyId = company._id;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, companyId: company ? company._id : undefined },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentCompanyId: user.currentCompanyId,
      },
      company,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let company = null;
    if (user.currentCompanyId) {
      company = await Company.findById(user.currentCompanyId);
    } else {
      const companyUser = await CompanyUser.findOne({ userId: user._id });
      if (companyUser) {
        user.currentCompanyId = companyUser.companyId;
        await user.save();
        company = await Company.findById(companyUser.companyId);
      }
    }

    const token = jwt.sign(
      { userId: user._id, companyId: user.currentCompanyId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentCompanyId: user.currentCompanyId,
      },
      company,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    
    let company = null;
    if (user.currentCompanyId) {
      company = await Company.findById(user.currentCompanyId);
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentCompanyId: user.currentCompanyId,
      },
      company,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // Standard placeholder for reset link email sending
  res.json({ message: `Password reset instructions sent to ${email}` });
};

export const completeOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const { name, logo, gstNumber, address, financialYear, industry, currency, timezone } = req.body;
    
    let company;
    if (req.companyId) {
      company = await Company.findByIdAndUpdate(
        req.companyId,
        {
          name,
          logo,
          gstNumber,
          address,
          financialYear,
          industry,
          currency,
          timezone,
          onboardingCompleted: true,
        },
        { new: true }
      );
    } else {
      company = await Company.create({
        name: name || 'My Company',
        logo,
        gstNumber,
        address,
        financialYear: financialYear || '2025-2026',
        industry: industry || 'Retail',
        currency: currency || 'INR',
        timezone: timezone || 'Asia/Kolkata',
        onboardingCompleted: true,
      });

      if (req.user) {
        req.user.currentCompanyId = company._id as any;
        await req.user.save();
        await CompanyUser.create({
          companyId: company._id,
          userId: req.user._id,
          role: req.user.role,
        });
      }
    }

    res.json({ message: 'Onboarding completed', company });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

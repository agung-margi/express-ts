import { Request, Response, NextFunction } from 'express'

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user || user._doc.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return next()
}

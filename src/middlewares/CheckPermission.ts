/**
 * Check permission middleware
 *
 * @author Anh Vu <anh.vu@vertics.co>
 *
 * @copyright Vertics Oy 2020
 */
import {Response} from 'express'
import {
	BadRequestError,
	ERROR_CODE,
	ForbiddenError,
	UnauthorizedError,
} from '../models/Error'
import {UserService} from '../services/User'
import {verifyJwtToken} from '../utils/auth'
import {IRequestWithUser} from '../interfaces/Request'
import {UserRole, UserStatus} from '../utils/enum'

export const CheckRoleMiddleware = (
	roles?: string[],
	message: string = `You don't have right to perform this action`,
) => async (
	req: IRequestWithUser,
	res: Response,
	next?: (err?: any) => any,
) => {
	try {
		// @ts-ignore
		const authHeader: string = req.headers[process.env.JWT_REQUEST_HEADER]
		if (!authHeader) {
			throw new UnauthorizedError(
				'No token found in authorization header',
				ERROR_CODE.UNAUTHORIZED,
			)
		}
		const jwtToken =
			authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null
		if (!jwtToken) {
			throw new UnauthorizedError(
				`Token should be in the form of 'Bearer token'`,
				ERROR_CODE.UNAUTHORIZED,
			)
		}
		// @ts-ignore
		const jwtPayload = await verifyJwtToken(jwtToken)
		const user = await new UserService().getUserById(jwtPayload.userId)
		if (!user) {
			throw new UnauthorizedError('Invalid jwt token', ERROR_CODE.INVALID_TOKEN)
		}

		if (user.status === UserStatus.DEACTIVATED) {
			throw new UnauthorizedError('This user is deactivated')
		}

		if (!roles || roles.length === 0) {
			req.user = user
			return next()
		}

		const accessibleToResource = roles.find(role => role === user.role)
		if (!accessibleToResource) {
			throw new ForbiddenError(message, ERROR_CODE.NO_PERMISSION)
		}
		req.user = user
		next()
	} catch (e) {
		next(e)
	}
}

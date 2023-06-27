const asyncHandler = require('express-async-handler');
const {
	queryUserByEmail,
	createUser,
	queryUserById,
	updateUser,
	deleteUser,
} = require('../models/userModel');
const variables = require('../config/variables');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

//@description     Register new user
//@route           POST /api/user/register
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		if (!username || !email || !password || !confirmPassword) {
			return res.status(400).send({
				message: 'Please fillup all the required fields.',
			});
		}
		if (password !== confirmPassword) {
			return res.status(400).send({ message: 'Passwords do not match.' });
		}

		try {
			const data = await queryUserByEmail(email);
			const userAlreadyExists = data.rows;

			if (userAlreadyExists.length !== 0) {
				return res
					.status(400)
					.send({ message: 'User already exists. No need to register again.' });
			} else {
				try {
					const user = {
						username,
						email,
						password: md5(password),
					};
					await createUser(user.username, user.email, user.password);
					return res.status(201).send({
						message: 'User created successfully.',
						data: { username: username, email: email },
					});
				} catch (err) {
					return res
						.status(500)
						.send({ message: 'Unexpected error occured while creating user.' });
				}
			}
		} catch (err) {
			return res
				.status(500)
				.send({ message: 'Unexpected error occured while fetching data.' });
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Internal server error.',
		});
	}
});

//@description     Authenticate the user
//@route           POST /api/user/login
//@access          Public
const authenticateUser = asyncHandler(async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			const data = await queryUserByEmail(email);
			const user = data.rows;

			if (user.length === 0) {
				return res
					.status(400)
					.send({ message: 'User not registered. Please sign up.' });
			} else {
				const pass = user[0].password;
				if (pass !== md5(password)) {
					return res.status(400).send({ message: 'Incorrect password' });
				}
				const token = jwt.sign(
					{ id: user[0].id, email: user[0].basic_info.email },
					variables.jwtSecretKey
				);
				return res
					.status(200)
					.send({ message: 'Successfully logged in.', token: token });
			}
		} catch (err) {
			return res
				.status(500)
				.send({ message: 'Unexpected error occured while fetching data.' });
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Internal server error.',
		});
	}
});

//@description     Get user details
//@route           GET /api/user/:userId
//@access          Protected
const getUserProfile = asyncHandler(async (req, res) => {
	try {
		const userId = req.params.userId;

		try {
			const data = await queryUserById(userId);
			const user = data.rows;
			if (user.length === 0) {
				return res.status(404).send({ message: 'User not found.' });
			}
			res.status(200).send({ message: 'Success', data: user });
		} catch (err) {
			return res
				.status(500)
				.send({ message: 'Unexpected error occured while fetching data.' });
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Internal server error.',
		});
	}
});

//@description     Update user details
//@route           PUT /api/user/:userId
//@access          Protected
const updateUserProfile = asyncHandler(async (req, res) => {
	try {
		const userId = req.params.userId;
		const updatedInfo = req.body;

		try {
			await updateUser(
				updatedInfo.basic_info,
				updatedInfo.interest,
				updatedInfo.account_info,
				userId
			);
			return res.status(200).send({ message: 'Update successful.' });
		} catch (err) {
			res
				.status(500)
				.send({ message: 'Unexpected error occured while updating info.' });
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Internal server error.',
		});
	}
});

//@description     Delete user account
//@route           DELETE /api/user/:userId
//@access          Protected
const deleteAccount = asyncHandler(async (req, res) => {
	try {
		const userId = req.params.userId;

		try {
			await deleteUser(userId);
			return res.status(200).send({ message: 'Account deleted successfully.' });
		} catch (err) {
			return res
				.status(500)
				.send({ message: 'Unexpected error occured while deleting user.' });
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Internal server error.',
		});
	}
});

module.exports = {
	registerUser,
	authenticateUser,
	getUserProfile,
	updateUserProfile,
	deleteAccount,
};

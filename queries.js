require('dotenv').config();

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'dbm',
  host: 'localhost',
  database: 'sheets',
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

const LOGGED_IN = '160380d5-e7c8-46a6-9b7d-7584c1ceaa32';
const GROUP_ID = '02655a8d-c32c-49a0-888b-f4e2cd6ac1b0';

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = request.params.id;

  pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createUser = (request, response) => {
  const { username, email } = request.body;

  pool.query(
    'INSERT INTO users (username, email) VALUES ($1, $2)',
    [username, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added.`);
    }
  );
};

const updateUser = (request, response) => {
  const id = request.params.id;
  const { username, email } = request.body;

  pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE user_id = $3',
    [username, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = request.params.id;

  pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// groups -- split later

const getGroups = (request, response) => {
  pool.query(
    'SELECT * FROM group_details ORDER BY group_id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getGroupById = (request, response) => {
  const id = request.params.id;

  pool.query(
    'SELECT * FROM group_details WHERE group_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createGroup = (request, response) => {
  const userId = LOGGED_IN;
  const groupRole = 'owner';
  const { groupName, description } = request.body;

  pool.query(
    'WITH first_insert as (INSERT INTO group_details(group_name, description, user_id) VALUES ($1, $2, $3) RETURNING group_id AS group_id) INSERT INTO group_registration(group_id, user_id, group_role) VALUES( (select group_id from first_insert), $4, $5);',
    [groupName, description, userId, userId, groupRole],
    (error, results) => {
      if (error) {
        throw error;
      }
      //const groupId = results.rows[0].group_id
      //joinGroup()
      response.status(201).send(`Group added.`);
    }
  );
};

const joinGroup = (request, response) => {
  const userId = LOGGED_IN;
  const groupRole = 'member';
  const { groupId } = request.body;

  pool.query(
    'INSERT INTO group_registration(group_id, user_id, group_role) VALUES ($1, $2, $3);',
    [GROUP_ID, userId, groupRole],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send('Group registered for user');
    }
  );
};

const updateGroup = (request, response) => {
  const groupId = request.params.id;
  const { groupName, description } = request.body;

  pool.query(
    'UPDATE group_details SET group_name = $1, description = $2 WHERE group_id = $3',
    [groupName, description, groupId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Group modified`);
    }
  );
};

const deleteGroup = (request, response) => {
  const id = request.params.id;

  pool.query(
    'DELETE FROM group_details WHERE group_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  );
};

const createSheet = (request, response) => {
  const userId = LOGGED_IN;
  const { sheetName } = request.body;

  pool.query(
    'INSERT INTO sheet_registration (user_id, sheet_name) VALUES ($1, $2)',
    [userId, sheetName],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added.`);
    }
  );
};

const addSheetToGroup = (request, response) => {
  pool.query(
    'UPDATE group_registration SET sheet_id = $1 WHERE group_id = $2',
    [sheetId, groupId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Group modified`);
    }
  );
};

const createSheetInstanceForUser = (request, response) => {
  pool.query(
    'INSERT INTO sheet_instance (sheet_id) VALUES ($1)',
    [sheetId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added.`);
    }
  );
};

// add handle
const updateSheetInstance = (request, response) => {
  pool.query(
    'UPDATE sheet_instance SET handle = $1 WHERE group_id = $2',
    [handle, groupId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Group modified`);
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getGroups,
  getGroupById,
  createGroup,
  joinGroup,
  updateGroup,
  deleteGroup,
  createSheet,
  addSheetToGroup,
  createSheetInstanceForUser,
  updateSheetInstance,
};

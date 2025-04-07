const pool = require("../config/index");
const { v4: uuidv4 } = require('uuid');

const generateUniqueId = () => {
  const prefix = 'UNEC';
  return prefix + uuidv4().toUpperCase(); 
}

const createOrderDb = async (orders, userId) => {
  if (orders.length === 0) return [];
  
  const values = [];
  const queryParams = [];
  const xref = generateUniqueId(); 

  orders.forEach((order, index) => {
    const offset = index * 4; 
    queryParams.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);

    values.push(userId);
    values.push(order.product_id);
    values.push(order.quantity);
    values.push(xref);  
  });

  const query = `
      INSERT INTO orders (user_id, product_id, quantity, order_no)
      VALUES ${queryParams.join(", ")}
      RETURNING *;
    `;

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error inserting orders:", error);
    throw error;
  }
};


const getOrderDb = async (userId) => {
  const { rows: order } = await pool.query(
    `SELECT products.*, orders.order_no, orders.id, orders.quantity 
     FROM orders 
     JOIN products ON products.product_id = orders.product_id
     WHERE orders.user_id = $1 AND orders.status <> 'DELETED'`,
    [userId]
  );
  return order;
};

const deleteOrderDb = async (id) => {
  const { rows: order } = await pool.query(
    `UPDATE orders
    SET status = 'DELETED'
    WHERE id = $1;
    `,[id]
  );
  return order;
};

const deleteOrderGroupDb = async (id) => {
  const { rows: order } = await pool.query(
    `UPDATE orders
      SET status = 'DELETED'
      WHERE order_no = $1`,
    [id]
  );
  return order;
};

module.exports = {
  createOrderDb,
  getOrderDb,
  deleteOrderGroupDb,
  deleteOrderDb
};

module.exports = (sequelize, type) => {
  return sequelize.define('product', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    base_price: type.NUMERIC,
    current_price: type.NUMERIC,
  })
};

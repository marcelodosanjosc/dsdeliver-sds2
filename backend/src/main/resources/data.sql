INSERT INTO tb_category (name) VALUES ('Pizzas');
INSERT INTO tb_category (name) VALUES ('Risotos');
INSERT INTO tb_category (name) VALUES ('Massas');
INSERT INTO tb_category (name) VALUES ('Bebidas');

INSERT INTO tb_role (authority) VALUES ('ROLE_CLIENTE');
INSERT INTO tb_role (authority) VALUES ('ROLE_FUNCIONARIO');

INSERT INTO tb_user (name, email, password, phone) VALUES ('Alex Cliente', 'cliente@gmail.com', '$2b$10$K4xipTimpJ97H1VZ8l4vsurzKW7VPAg1KGO0/laxpVN0xRk9Xkgx.', '999999999');
INSERT INTO tb_user (name, email, password, phone) VALUES ('Maria Funcionario', 'funcionario@gmail.com', '$2b$10$K4xipTimpJ97H1VZ8l4vsurzKW7VPAg1KGO0/laxpVN0xRk9Xkgx.', '988888888');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);

INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Pizza Bacon', 49.9, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/pizza_bacon.jpg', 'Pizza de bacon com mussarela, orégano, molho especial e tempero da casa.', 1);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Pizza Moda da Casa', 59.9, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/pizza_moda.jpg', 'Pizza à moda da casa, com molho especial e todos ingredientes básicos, e queijo à sua escolha.', 1);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Pizza Portuguesa', 45.0, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/pizza_portuguesa.jpg', 'Pizza Portuguesa com molho especial, mussarela, presunto, ovos e especiarias.', 1);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Risoto de Carne', 52.0, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/risoto_carne.jpg', 'Risoto de carne com especiarias e um delicioso molho de acompanhamento.', 2);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Risoto Funghi', 59.95, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/pizza_funghi.jpg', 'Risoto Funghi feito com ingredientes finos e o toque especial do chef.', 2);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Macarrão Espaguete', 35.9, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/macarrao_espaguete.jpg', 'Macarrão fresco espaguete com molho especial e tempero da casa.', 3);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Macarrão Fusili', 38.0, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/macarrao_fusili.jpg', 'Macarrão fusili com toque do chef e especiarias.', 3);
INSERT INTO tb_product (name, price, image_Uri, description, category_id) VALUES ('Macarrão Penne', 37.9, 'https://raw.githubusercontent.com/devsuperior/sds2/master/assets/macarrao_penne.jpg', 'Macarrão penne fresco ao dente com tempero especial.', 3);

INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (0, -23.561680, -46.656139, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T10:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (1, -22.946779, -43.217753, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T15:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (0, -25.439787, -49.237759, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T16:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (0, -23.561680, -46.656139, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T12:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (1, -23.561680, -46.656139, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T08:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (0, -23.561680, -46.656139, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T14:00:00Z', 1);
INSERT INTO tb_order (status, latitude, longitude, address, moment, client_id) VALUES (0, -23.561680, -46.656139, 'Avenida Paulista, 1500', TIMESTAMP WITH TIME ZONE '2021-01-01T09:00:00Z', 1);

INSERT INTO tb_order_product (order_id, product_id) VALUES (1 , 1);
INSERT INTO tb_order_product (order_id, product_id) VALUES (1 , 4);
INSERT INTO tb_order_product (order_id, product_id) VALUES (2 , 2);
INSERT INTO tb_order_product (order_id, product_id) VALUES (2 , 5);
INSERT INTO tb_order_product (order_id, product_id) VALUES (2 , 8);
INSERT INTO tb_order_product (order_id, product_id) VALUES (3 , 3);
INSERT INTO tb_order_product (order_id, product_id) VALUES (3 , 4);
INSERT INTO tb_order_product (order_id, product_id) VALUES (4 , 2);
INSERT INTO tb_order_product (order_id, product_id) VALUES (4 , 6);
INSERT INTO tb_order_product (order_id, product_id) VALUES (5 , 4);
INSERT INTO tb_order_product (order_id, product_id) VALUES (5 , 6);
INSERT INTO tb_order_product (order_id, product_id) VALUES (6 , 5);
INSERT INTO tb_order_product (order_id, product_id) VALUES (6 , 1);
INSERT INTO tb_order_product (order_id, product_id) VALUES (7 , 7);
INSERT INTO tb_order_product (order_id, product_id) VALUES (7 , 5);
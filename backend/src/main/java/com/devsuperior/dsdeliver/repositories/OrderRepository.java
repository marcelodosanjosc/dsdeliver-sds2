package com.devsuperior.dsdeliver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devsuperior.dsdeliver.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query("SELECT DISTINCT obj FROM Order obj LEFT JOIN FETCH obj.products "
			+ " WHERE obj.status = 0 ORDER BY obj.moment ASC")
	List<Order> findOrdersWithProducts();

	@Query("SELECT DISTINCT obj FROM Order obj LEFT JOIN FETCH obj.products "
			+ " WHERE obj.client.email = :email ORDER BY obj.moment DESC")
	List<Order> findMyOrders(@Param("email") String email);

	@Query("SELECT DISTINCT obj FROM Order obj LEFT JOIN FETCH obj.products "
			+ " WHERE obj.id = :id")
	Optional<Order> findByIdWithProducts(@Param("id") Long id);
}

package com.devsuperior.dsdeliver.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dsdeliver.dto.ProductDTO;
import com.devsuperior.dsdeliver.entities.Category;
import com.devsuperior.dsdeliver.entities.Product;
import com.devsuperior.dsdeliver.repositories.CategoryRepository;
import com.devsuperior.dsdeliver.repositories.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ProductRepository repository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public List<ProductDTO> findAll(Long categoryId) {
		List<Product> list;
		if (categoryId != null && categoryId > 0) {
			list = repository.findByCategoryIdOrderByNameAsc(categoryId);
		} else {
			list = repository.findAllByOrderByNameAsc();
		}
		return list.stream().map(ProductDTO::new).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public ProductDTO findById(Long id) {
		Product entity = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found: " + id));
		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		Product entity = new Product();
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {
		Product entity = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found: " + id));
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return new ProductDTO(entity);
	}

	@Transactional
	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new RuntimeException("Product not found: " + id);
		}
		repository.deleteById(id);
	}

	private void copyDtoToEntity(ProductDTO dto, Product entity) {
		entity.setName(dto.getName());
		entity.setPrice(dto.getPrice());
		entity.setDescription(dto.getDescription());
		entity.setImageUri(dto.getImageUri());
		if (dto.getCategory() != null && dto.getCategory().getId() != null) {
			Category category = categoryRepository.findById(dto.getCategory().getId())
					.orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategory().getId()));
			entity.setCategory(category);
		} else {
			entity.setCategory(null);
		}
	}
}

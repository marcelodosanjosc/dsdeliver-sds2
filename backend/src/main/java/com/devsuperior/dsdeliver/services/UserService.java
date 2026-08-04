package com.devsuperior.dsdeliver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dsdeliver.dto.UserDTO;
import com.devsuperior.dsdeliver.dto.UserInsertDTO;
import com.devsuperior.dsdeliver.entities.Role;
import com.devsuperior.dsdeliver.entities.User;
import com.devsuperior.dsdeliver.repositories.RoleRepository;
import com.devsuperior.dsdeliver.repositories.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		if (repository.findByEmail(dto.getEmail()).isPresent()) {
			throw new RuntimeException("Email already registered: " + dto.getEmail());
		}

		User entity = new User();
		entity.setName(dto.getName());
		entity.setEmail(dto.getEmail());
		entity.setPhone(dto.getPhone());
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));

		String roleName = (dto.getEmployee() != null && dto.getEmployee()) ? "ROLE_FUNCIONARIO" : "ROLE_CLIENTE";
		Role role = roleRepository.findByAuthority(roleName)
				.orElseGet(() -> roleRepository.save(new Role(null, roleName)));

		entity.getRoles().add(role);
		entity = repository.save(entity);
		return new UserDTO(entity);
	}

	@Transactional(readOnly = true)
	public UserDTO findByEmail(String email) {
		User entity = repository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found: " + email));
		return new UserDTO(entity);
	}
}

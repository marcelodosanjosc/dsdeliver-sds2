package com.devsuperior.dsdeliver.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dsdeliver.config.JwtTokenProvider;
import com.devsuperior.dsdeliver.dto.AuthDTO;
import com.devsuperior.dsdeliver.dto.TokenDTO;
import com.devsuperior.dsdeliver.dto.UserDTO;
import com.devsuperior.dsdeliver.entities.Role;
import com.devsuperior.dsdeliver.entities.User;
import com.devsuperior.dsdeliver.repositories.UserRepository;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenProvider tokenProvider;

	@Transactional(readOnly = true)
	public TokenDTO login(AuthDTO dto) {
		User user = userRepository.findByEmail(dto.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid email or password"));

		if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid email or password");
		}

		List<String> roles = user.getRoles().stream()
				.map(Role::getAuthority)
				.collect(Collectors.toList());

		String token = tokenProvider.generateToken(user.getEmail(), roles);

		return new TokenDTO(token, new UserDTO(user));
	}
}

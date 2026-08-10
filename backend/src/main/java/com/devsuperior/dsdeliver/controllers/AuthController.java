package com.devsuperior.dsdeliver.controllers;

import java.net.URI;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.devsuperior.dsdeliver.dto.AuthDTO;
import com.devsuperior.dsdeliver.dto.TokenDTO;
import com.devsuperior.dsdeliver.dto.UserDTO;
import com.devsuperior.dsdeliver.dto.UserInsertDTO;
import com.devsuperior.dsdeliver.services.AuthService;
import com.devsuperior.dsdeliver.services.UserService;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@PostMapping(value = "/login")
	public ResponseEntity<TokenDTO> login(@RequestBody AuthDTO dto) {
		TokenDTO tokenDto = authService.login(dto);
		return ResponseEntity.ok().body(tokenDto);
	}

	@PostMapping(value = "/register")
	public ResponseEntity<UserDTO> register(@RequestBody UserInsertDTO dto) {
		UserDTO userDto = userService.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/users/{id}")
				.buildAndExpand(userDto.getId()).toUri();
		return ResponseEntity.created(uri).body(userDto);
	}

	@GetMapping(value = "/me")
	public ResponseEntity<UserDTO> getMe(Principal principal) {
		String email = (principal != null) ? principal.getName() : null;
		UserDTO userDto = authService.getAuthenticatedUser(email);
		return ResponseEntity.ok().body(userDto);
	}
}

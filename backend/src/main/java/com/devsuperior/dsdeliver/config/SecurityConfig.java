package com.devsuperior.dsdeliver.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private Environment env;

	@Autowired
	private JwtTokenProvider tokenProvider;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		if (Arrays.asList(env.getActiveProfiles()).contains("test")) {
			http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));
		}

		http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/h2-console/**").permitAll()
				.requestMatchers("/auth/login", "/auth/register").permitAll()
				.requestMatchers(HttpMethod.GET, "/auth/me").hasAnyAuthority("ROLE_CLIENTE", "ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.GET, "/products/**", "/categories/**").permitAll()
				.requestMatchers(HttpMethod.POST, "/products/**", "/categories/**").hasAuthority("ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.PUT, "/products/**", "/categories/**").hasAuthority("ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.DELETE, "/products/**", "/categories/**").hasAuthority("ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.GET, "/orders/me").hasAnyAuthority("ROLE_CLIENTE", "ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.GET, "/orders/*").hasAnyAuthority("ROLE_CLIENTE", "ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.POST, "/orders").hasAnyAuthority("ROLE_CLIENTE", "ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.PUT, "/orders/*/cancel").hasAnyAuthority("ROLE_CLIENTE", "ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.GET, "/orders").hasAuthority("ROLE_FUNCIONARIO")
				.requestMatchers(HttpMethod.PUT, "/orders/*/delivered").hasAuthority("ROLE_FUNCIONARIO")
				.anyRequest().authenticated()
			)
			.addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration().applyPermitDefaultValues();
		configuration.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE", "OPTIONS"));
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}

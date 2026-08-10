package com.devsuperior.dsdeliver.controllers.exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.devsuperior.dsdeliver.services.exceptions.DatabaseException;
import com.devsuperior.dsdeliver.services.exceptions.ResourceNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ResourceExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<StandardError> entityNotFound(ResourceNotFoundException e, HttpServletRequest request) {
		HttpStatus status = HttpStatus.NOT_FOUND;
		StandardError err = new StandardError(
				Instant.now(),
				status.value(),
				"Resource not found",
				e.getMessage(),
				request.getRequestURI()
		);
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(DatabaseException.class)
	public ResponseEntity<StandardError> database(DatabaseException e, HttpServletRequest request) {
		HttpStatus status = HttpStatus.BAD_REQUEST;
		StandardError err = new StandardError(
				Instant.now(),
				status.value(),
				"Database exception",
				e.getMessage(),
				request.getRequestURI()
		);
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<StandardError> illegalArgument(IllegalArgumentException e, HttpServletRequest request) {
		HttpStatus status = HttpStatus.BAD_REQUEST;
		StandardError err = new StandardError(
				Instant.now(),
				status.value(),
				"Invalid argument",
				e.getMessage(),
				request.getRequestURI()
		);
		return ResponseEntity.status(status).body(err);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<StandardError> generalRuntime(RuntimeException e, HttpServletRequest request) {
		HttpStatus status = HttpStatus.BAD_REQUEST;
		StandardError err = new StandardError(
				Instant.now(),
				status.value(),
				"Business error",
				e.getMessage(),
				request.getRequestURI()
		);
		return ResponseEntity.status(status).body(err);
	}
}

package com.devsuperior.dsdeliver.dto;

public class UserInsertDTO extends UserDTO {

	private static final long serialVersionUID = 1L;

	private String password;
	private Boolean employee;

	public UserInsertDTO() {
		super();
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean getEmployee() {
		return employee;
	}

	public void setEmployee(Boolean employee) {
		this.employee = employee;
	}
}

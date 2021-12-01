package com.example.VaccinationManagementSystem.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Class to return error response in specified manner
 * Attribute ErrorDetail contains error code and message to be displayed to user
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorResponse {
    ErrorDetail BadRequest;
}



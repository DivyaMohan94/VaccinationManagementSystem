package com.example.VaccinationManagementSystem.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Class to return error details in specified manner
 * Attribute code contains the error code to be returned.
 * Attribute msg contains the error message to be displayed to user.
 */
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ErrorDetail {
    String code;
    String msg;
}

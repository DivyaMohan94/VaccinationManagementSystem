package com.example.VaccinationManagementSystem.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Class created to display success response to user
 * Attribute code contains success response code.
 * Attribute msg contains success message to be displayed to user.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SuccessResponse {
    String code;
    String msg;
}

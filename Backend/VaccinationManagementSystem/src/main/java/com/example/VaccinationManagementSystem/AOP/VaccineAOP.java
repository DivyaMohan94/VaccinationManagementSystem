package com.example.VaccinationManagementSystem.AOP;

import org.apache.tomcat.util.json.ParseException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Aspect
@Component
@Order(0)
public class VaccineAOP {
    // Throws an IllegalArgumentException if vaccine manufacturer name is not 3 characters long
    @Before("execution(public * com.example.VaccinationManagementSystem.Service.VaccineService.createVaccine(..))")
    public void vaccineManufacturer(JoinPoint joinPoint) throws ParseException {
        Object[] obj = joinPoint.getArgs();
        if(joinPoint.getArgs()[2].toString().length() < 3 ) throw new IllegalArgumentException("Manufacturer name must be at least 3 characters long.");
   }
}


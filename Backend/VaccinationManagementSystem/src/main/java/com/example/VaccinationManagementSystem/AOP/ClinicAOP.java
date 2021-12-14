package com.example.VaccinationManagementSystem.AOP;

import com.fasterxml.jackson.core.JsonParser;
import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.json.JSONObject;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Aspect
@Component
@Order(0)
public class ClinicAOP {
    // Throws an IllegalArgumentException if clinic is not open for 8 hours
    @Before("execution(public * com.example.VaccinationManagementSystem.Service.ClinicService.createClinic(..))")
    public void clinicTimings(JoinPoint joinPoint) throws ParseException {
        LocalTime start = (LocalTime)joinPoint.getArgs()[3];
        LocalTime end = (LocalTime) joinPoint.getArgs()[4];
        int diff = (int) java.time.temporal.ChronoUnit.HOURS.between(start, end);
        if(diff < 8 || end.isBefore(start)) throw new IllegalArgumentException("Clinic must be open for at least 8 hours.");
    }
}

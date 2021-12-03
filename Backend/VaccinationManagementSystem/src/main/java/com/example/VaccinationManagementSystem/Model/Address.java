package com.example.VaccinationManagementSystem.Model;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
    private String street;
    private Integer number;
    private String city;
    private String state;
    private String zipcode;

    public Address(String street, Integer number, String city, String state, String zipcode) {
        this.street = street;
        this.number = number;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
    }

    public Address() {

    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    @Override
    public String toString() {
        return "Address{" +
                "street='" + street + '\'' +
                ", number=" + number +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", zipcode='" + zipcode + '\'' +
                '}';
    }
}

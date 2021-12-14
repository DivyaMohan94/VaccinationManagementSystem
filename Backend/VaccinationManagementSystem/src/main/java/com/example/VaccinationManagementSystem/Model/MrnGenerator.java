package com.example.VaccinationManagementSystem.Model;

import org.hibernate.HibernateException;
import org.hibernate.boot.MappingException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;
import org.hibernate.internal.util.config.ConfigurationHelper;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.LongType;
import org.hibernate.type.Type;

import java.util.Properties;

public class MrnGenerator extends SequenceStyleGenerator {
    public static final String VALUE_PREFIX_PARAMETER = "valuePrefix";
    public static final String VALUE_PREFIX_DEFAULT = "";
    public static String prefixvalue;

    /**
     * Custom generator for passenger id
     * @param sharedSessionContractImplementor
     * @param object
     * @return unique string to identify passenger
     * @throws HibernateException
     */
    @Override
    public String generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object object) throws HibernateException {
        return prefixvalue + super.generate(sharedSessionContractImplementor, object);
    }

    /**
     * @param type
     * @param params
     * @param serviceRegistry
     * @throws MappingException
     */
    @Override
    public void configure(Type type, Properties params,
                          ServiceRegistry serviceRegistry) throws MappingException {
        super.configure(LongType.INSTANCE, params, serviceRegistry);
        prefixvalue = ConfigurationHelper.getString(VALUE_PREFIX_PARAMETER,
                params, VALUE_PREFIX_DEFAULT);
    }
}

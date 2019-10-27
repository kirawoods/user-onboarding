import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const NewUserForm = props => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (props.status) {
      setUsers([...users, props.status]);
    }
  }, [props.status]);

  return (
    <div className="new-user-form">
      <h3>Add New User</h3>
      <Form>
        <Field type="text" name="name" placeholder="Name" />
        {props.touched.name && props.errors.name && (
          <p className="error-message">{props.errors.name}</p>
        )}
        <Field type="email" name="email" placeholder="Email" />
        {props.touched.email && props.errors.email && (
          <p className="error-message">{props.errors.email}</p>
        )}
        <Field type="password" name="password" placeholder="Password" />
        {props.touched.password && props.errors.password && (
          <p className="error-message">{props.errors.password}</p>
        )}

        <label>
          <Field type="checkbox" name="terms" checked={props.values.terms} />
          <span>Accept Terms of Service</span>
        </label>
        {props.touched.terms && props.errors.terms && (
          <p className="error-message">{props.errors.terms}</p>
        )}

        <Field component="select" name="role">
          <option value="Software Engineer">Software Engineer</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Designer">Designer</option>
        </Field>
        <button type="submit">Submit</button>
      </Form>

      <div className="user-display">
        {users.map(user => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const myMapPropsToValues = props => {
  console.log(props);
  const returnObject = {
    name: props.name || "",
    email: props.email || "",
    password: props.password || "",
    terms: props.terms || false,
    role: props.role || ""
  };
  return returnObject;
};

const myHandleSubmit = (values, { setStatus, resetForm }) => {
  axios
    .post("https://reqres.in/api/users/", values)
    .then(response => {
      console.log(response);
      setStatus(response.data);
      resetForm();
    })
    .catch(error => {
      console.log(error);
    });
};

const yupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter a name")
    .min(2, "Must be at least 2 characters long"),
  email: Yup.string()
    .required("Please enter an email")
    .email("Must enter a valid email address"),
  password: Yup.string()
    .required("Please enter a password")
    .min(8, "Your password must contain at least 8 characters"),
  terms: Yup.bool()
    .required("Please agree to our Terms of Service")
    .oneOf([true], "Please agree to our Terms of Service")
});

const formikObj = {
  mapPropsToValues: myMapPropsToValues,
  validationSchema: yupSchema,
  handleSubmit: myHandleSubmit
};

const EnhancedFormHOC = withFormik(formikObj);

const EnhancedNewUserForm = EnhancedFormHOC(NewUserForm);

export default EnhancedNewUserForm;

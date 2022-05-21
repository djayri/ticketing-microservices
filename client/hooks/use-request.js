import React, { useState } from "react";
import axios from "axios";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      setErrors(null);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul>
              {err.response.data.errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
  };
  return { doRequest, errors };
};

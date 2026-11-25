import "../../../shared/ui/form.css";
import "./LoginForm.css";
import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { setUserAction } from "../../../entities/user";
import { IS_MOCK_ONLY } from "../../../shared/config/api";
import { getErrorMessage, getErrorStatus } from "../../../shared/lib/apiError";
import { useAppDispatch } from "../../../shared/lib/redux";
import { LoadingOverlay } from "../../../shared/ui/LoadingOverlay";
import { loginRequest } from "../api/authApi";

interface Props {
  onSuccess: () => void;
}

export const LoginForm: FC<Props> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.username.trim() || !formData.password) return;

    setLoading(true);
    setError(null);
    try {
      const user = await loginRequest(formData);
      dispatch(setUserAction({ username: user.username }));
      onSuccess();
    } catch (err) {
      setError(
        getErrorStatus(err) === 401
          ? "Неверный логин или пароль"
          : getErrorMessage(err, "Не удалось войти"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="form-card login-form" onSubmit={handleSubmit}>
      {loading && <LoadingOverlay />}
      {IS_MOCK_ONLY && (
        <Alert variant="warning" className="form-alert">
          Демо-версия на GitHub Pages работает только с mock-данными — вход недоступен
        </Alert>
      )}
      {error && <Alert variant="danger" className="form-alert">{error}</Alert>}

      <Form.Group controlId="username" className="field">
        <Form.Label className="field__label">Логин</Form.Label>
        <Form.Control
          className="field__input"
          type="text"
          name="username"
          autoComplete="username"
          maxLength={100}
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="Например, archaeologist_main"
        />
      </Form.Group>

      <Form.Group controlId="password" className="field">
        <Form.Label className="field__label">Пароль</Form.Label>
        <Form.Control
          className="field__input"
          type="password"
          name="password"
          autoComplete="current-password"
          maxLength={255}
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
        />
      </Form.Group>

      <div className="action-area">
        <Button type="submit" variant="primary" disabled={loading || IS_MOCK_ONLY}>Войти</Button>
      </div>
    </Form>
  );
};

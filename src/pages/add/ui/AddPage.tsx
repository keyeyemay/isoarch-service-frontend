import "../../../shared/ui/page.css";
import { useEffect, type FC } from "react";
import { Alert } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import {
  createDraft,
  deleteSignature,
  getDraft,
  publishDraft,
  useSignatureDraft,
  useSignaturesError,
  useSignaturesLoading,
  type NewSignatureData,
  type PublishSignatureData,
} from "../../../entities/isotopic-signature";
import { useIsAuthenticated } from "../../../entities/user";
import { CreateDraftForm, PublishDraftForm } from "../../../features/create-signature";
import { DeleteSignatureButton } from "../../../features/delete-signature";
import { ROUTES } from "../../../shared/config/routes";
import { useAppDispatch } from "../../../shared/lib/redux";
import { TopNav } from "../../../widgets/top-nav";

export const AddPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const draft = useSignatureDraft();
  const loading = useSignaturesLoading();
  const error = useSignaturesError();

  useEffect(() => {
    if (isAuthenticated) dispatch(getDraft());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: ROUTES.ADD }} replace />;
  }

  const handleCreate = (data: NewSignatureData) => {
    dispatch(createDraft(data));
  };

  const handlePublish = async (data: PublishSignatureData) => {
    if (!draft) return;
    const result = await dispatch(publishDraft({ id: draft.id, data }));
    if (publishDraft.fulfilled.match(result)) {
      navigate(`${ROUTES.FEED}/${result.payload.id}`);
    }
  };

  const handleDelete = () => {
    if (draft) dispatch(deleteSignature(draft.id));
  };

  return (
    <>
      <TopNav />
      <main className="page-main page-main--form">
        <div className="page-header">
          <h1 className="page-title">{draft ? `Публикация: ${draft.title}` : "Новая сигнатура"}</h1>
          <div className="page-title__bar" />
        </div>
        <p className="helper">
          {draft
            ? "Черновик сохранён. Заполните результаты анализа и опубликуйте."
            : "Сначала загрузите фото и короткое видео, затем заполните результаты анализа."}
        </p>

        {error && <Alert variant="danger" className="page-alert">{error}</Alert>}

        {draft ? (
          <PublishDraftForm
            key={draft.id}
            draft={draft}
            onPublish={handlePublish}
            disabled={loading}
            deleteAction={
              <DeleteSignatureButton
                onDelete={handleDelete}
                disabled={loading}
                label="Удалить черновик"
                confirmText="Удалить черновик?"
              />
            }
          />
        ) : (
          <CreateDraftForm onCreate={handleCreate} disabled={loading} />
        )}
      </main>
    </>
  );
};

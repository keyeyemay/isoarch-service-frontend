/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_create_draft_services_post */
export interface BodyCreateDraftServicesPost {
  /**
   * Title
   * Название исследования
   */
  title: string;
  /**
   * Image
   * PNG/JPEG/WebP до 10 МиБ
   */
  image: File | Blob;
  /**
   * Video
   * MP4 до 64 МиБ, до 60 секунд
   */
  video: File | Blob;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** LikeRequest */
export interface LikeRequest {
  /**
   * Like
   * @min 0
   * @max 1
   */
  like: number;
}

/** LikeResponse */
export interface LikeResponse {
  /** Like */
  like: 0 | 1;
  /** Likes Count */
  likes_count: number;
}

/** PublishRequest */
export interface PublishRequest {
  /**
   * Title
   * Название; если не задано, сохраняется прежнее
   */
  title?: string | null;
  /**
   * Description
   * Описание рациона и результатов исследования
   * @minLength 1
   * @maxLength 10000
   */
  description: string;
  /**
   * Delta N15
   * Значение δ¹⁵N, ‰
   */
  delta_n15: number;
  /**
   * Delta C13
   * Значение δ¹³C, ‰
   */
  delta_c13: number;
}

/** ServiceDraftResponse */
export interface ServiceDraftResponse {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Delta N15 */
  delta_n15: number | null;
  /** Delta C13 */
  delta_c13: number | null;
  /** Image File */
  image_file: string | null;
  /** Video File */
  video_file: string | null;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
}

/** ServiceResponse */
export interface ServiceResponse {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Delta N15 */
  delta_n15: number | null;
  /** Delta C13 */
  delta_c13: number | null;
  /** Image File */
  image_file: string | null;
  /** Video File */
  video_file: string | null;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Status */
  status: "published";
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Creator Id */
  creator_id: number;
  /** Moderator Id */
  moderator_id: number | null;
  /** Formed At */
  formed_at: string | null;
  /** Completed At */
  completed_at: string | null;
  /** Is Creator */
  is_creator: 0 | 1;
  /** Is Liked */
  is_liked: 0 | 1;
  /** Likes Count */
  likes_count: number;
}

/** UserLogin */
export interface UserLogin {
  /**
   * Username
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 255
   */
  password: string;
}

/** UserRegister */
export interface UserRegister {
  /**
   * Username
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 255
   */
  password: string;
  /** Full Name */
  full_name?: string | null;
  /** Email */
  email?: string | null;
}

/** UserResponse */
export interface UserResponse {
  /** Id */
  id: number;
  /** Username */
  username: string;
  /** Full Name */
  full_name: string | null;
  /** Email */
  email: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title IsoArch — Изотопные сигнатуры
 * @version 4.0.0
 *
 * ЛР4. Публичное чтение; черновики и изменения требуют cookie-сессии. Сначала выполните POST /auth/login. Браузер отправляет cookie автоматически. В Postman: Cookie: session_id=<UUID> из Set-Cookie. Регистрация и вход доступны гостям. Статус операции задаёт HTTP-код; поле status услуги обозначает её состояние в предметной области.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  services = {
    /**
     * @description Публичный список. Для гостя is_creator/is_liked=0; для сессии — персональные флаги 0/1.
     *
     * @tags Изотопные исследования
     * @name GetServices
     * @summary Опубликованные услуги с фильтрацией
     * @request GET:/services
     * @secure
     */
    getServices: (
      query?: {
        /**
         * C13 Max
         * Верхний порог δ¹³C (‰)
         */
        c13_max?: number | null;
        /**
         * Filter
         * Поиск по названию
         * @maxLength 255
         * @default ""
         */
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceResponse[], HTTPValidationError>({
        path: `/services`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Автор определяется сессией. Проверить оба бинарных файла, загрузить в MinIO, сохранить черновик.
     *
     * @tags Изотопные исследования
     * @name CreateDraft
     * @summary Создать черновик с фото и коротким видео
     * @request POST:/services
     * @secure
     */
    createDraft: (
      data: BodyCreateDraftServicesPost,
      params: RequestParams = {},
    ) =>
      this.request<ServiceDraftResponse, void | HTTPValidationError>({
        path: `/services`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Выдать опубликованную запись; next=true переводит к следующей по ID с возвратом к первой.
     *
     * @tags Изотопные исследования
     * @name GetFeedById
     * @summary Публикация или следующая запись ленты
     * @request GET:/services/feed/{id}
     * @secure
     */
    getFeedById: (
      id: number,
      query?: {
        /**
         * Next
         * Перейти к следующей публикации по кругу
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceResponse, void | HTTPValidationError>({
        path: `/services/feed/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Единственный черновик текущего пользователя либо null. ID пользователя не принимается.
     *
     * @tags Изотопные исследования
     * @name GetDraft
     * @summary Собственный черновик по сессии
     * @request GET:/services/draft
     * @secure
     */
    getDraft: (params: RequestParams = {}) =>
      this.request<ServiceDraftResponse | null, void>({
        path: `/services/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Опубликовать черновик или обновить публикацию. Повторный PUT сохраняет дату публикации; чужие и удалённые записи недоступны.
     *
     * @tags Изотопные исследования
     * @name PublishDraft
     * @summary Опубликовать или обновить собственную запись
     * @request PUT:/services/{id}
     * @secure
     */
    publishDraft: (
      id: number,
      data: PublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<ServiceResponse, void | HTTPValidationError>({
        path: `/services/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Только автор. Строка, лайки и файлы сохраняются; статус меняется на deleted.
     *
     * @tags Изотопные исследования
     * @name DeleteService
     * @summary Логически удалить собственную услугу
     * @request DELETE:/services/{id}
     * @secure
     */
    deleteService: (id: number, params: RequestParams = {}) =>
      this.request<void, void | HTTPValidationError>({
        path: `/services/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Идемпотентный лайк текущего пользователя; только для опубликованных услуг.
     *
     * @tags Изотопные исследования
     * @name ToggleLike
     * @summary Поставить (1) или снять (0) лайк
     * @request POST:/services/{id}/like
     * @secure
     */
    toggleLike: (id: number, data: LikeRequest, params: RequestParams = {}) =>
      this.request<LikeResponse, void | HTTPValidationError>({
        path: `/services/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}

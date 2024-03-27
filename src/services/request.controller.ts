import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";

const fetchRequest = (token: string) => {
  const deleted = async <T>(url: string, payload: T): Promise<T | unknown> => {
    try {
      const header = {
        method: HttpMethodsEnum.DELETE,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": ContentTypeEnum.JSON,
          Authorization: `Bearer ${token}`,
        },
      };
      const petition = await fetch(url, header);
      if (petition.status === 201) {
        const resolve = await petition.json();
        return resolve;
      }
    } catch (e) {
      throw Error("Error al hacer post - " + e);
    }
  };

  const post = async <T>(url: string, payload: T): Promise<T | unknown> => {
    try {
      const header = {
        method: HttpMethodsEnum.POST,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": ContentTypeEnum.JSON,
          Authorization: `Bearer ${token}`,
        },
      };
      const petition = await fetch(url, header);
      if (petition.status === 201) {
        const resolve = await petition.json();
        return resolve;
      }
    } catch (e) {
      throw Error("Error al hacer post - " + e);
    }
  };

  const put = async <T>(url: string, payload: T): Promise<T | unknown> => {
    try {
      const header = {
        method: HttpMethodsEnum.PUT,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": ContentTypeEnum.JSON,
          Authorization: `Bearer ${token}`,
        },
      };
      const petition = await fetch(url, header);
      if (petition.status === 201) {
        const resolve = await petition.json();
        return resolve;
      }
    } catch (e) {
      throw Error("Error al hacer post - " + e);
    }
  };

  const get = async <T>(url: string): Promise<T | unknown> => {
    try {
      const header = {
        headers: {
          "Content-Type": ContentTypeEnum.JSON,
          Authorization: `Bearer ${token}`,
        },
      };
      const petition = await fetch(url, header);
      if (petition.status === 200) {
        const resolve = await petition.json();
        return resolve;
      }
    } catch (e) {
      throw Error("Error al hacer post - " + e);
    }
  };

  return {
    post,
    put,
    get,
    delete: deleted,
  };
};

export default fetchRequest;

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { EDbNames } from "@/enums/db.enum";
import { firestore } from "@firebase/config";
import IDataBase from "./interface/idatabase.interface";

class FirestoreController implements IDataBase {
  private dbname: EDbNames;
  private subcat: string = "";

  constructor(dbname: EDbNames, subcat: string) {
    this.dbname = dbname;
    this.subcat = subcat;
  }

  async list<T>(
    callback?:
      | ((condition: T, index?: number | undefined) => T | unknown)
      | undefined,
  ): Promise<T | unknown> {
    const ref = doc(firestore, this.dbname, this.subcat);
    const collection = await getDoc(ref);
    if (collection.exists()) {
      const data = collection.data();
      const itms: Array<T> = data.data;
      if (callback === undefined) return itms;
      const filter = itms.filter(callback);
      return filter;
    }
    return [];
  }

  async create<T>(payload: T): Promise<T | unknown> {
    try {
      const ref = doc(firestore, this.dbname, this.subcat);
      const collection = await getDoc(ref);
      if (collection !== null) {
        if (collection.exists()) {
          const data = collection.data();
          const itms: Array<T> = data.data;
          itms.push({
            ...payload,
            createAt: new Date().getTime(),
            updateAt: new Date().getTime(),
          });
          const newpayload = {
            data: itms,
          };
          await updateDoc(ref, newpayload);
          return true;
        } else {
          const newpayload = {
            data: [
              {
                ...payload,
                createAt: new Date().getTime(),
                updateAt: new Date().getTime(),
              },
            ],
          };
          await setDoc(ref, newpayload);
          return true;
        }
      }
      throw Error("Error: No puedes crear un item en una collección nula");
    } catch (e) {
      return false;
    }
  }

  async update<T>(
    payload: T,
    callback: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown> {
    try {
      const ref = doc(firestore, this.dbname, this.subcat);
      const collection = await getDoc(ref);
      if (collection.exists()) {
        const data = collection.data();
        const itms = data.data as Array<T>;
        const newItms = itms.map((itm: T, index: number) => {
          if (callback(itm, index) === true) {
            return { ...payload, updateAt: new Date().getTime() };
          }
          return itm;
        });
        const newData = { data: newItms };
        console.log(newData, payload);
        await updateDoc(ref, newData);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async delete<T>(
    callback: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown> {
    try {
      const ref = doc(firestore, this.dbname, this.subcat);
      const collection = await getDoc(ref);
      if (collection.exists()) {
        const data = collection.data();
        const itms = data.data as Array<T>;
        const find = itms.findIndex(callback);
        if (find !== -1) {
          itms.splice(find, 1);
          const payload = {
            data: itms,
          };
          await updateDoc(ref, payload);
          return true;
        }
        return false;
      } else {
        return false;
      }
    } catch (e) {
      throw Error("Error: No puedes buscar en una collección nula");
    }
  }

  async find<T>(
    callback: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown> {
    const ref = doc(firestore, this.dbname, this.subcat);
    const collection = await getDoc(ref);
    if (collection !== null) {
      if (collection.exists()) {
        const data = collection.data();
        const finding = data.data as Array<T>;
        let j = finding.length - 1;
        let finded = null;
        for (let i = 0; i < Math.floor(finding.length / 2); i++) {
          if (callback(finding[i], i) === true) {
            finded = finding[i];
            break;
          }
          if (callback(finding[j], j) === true) {
            finded = finding[j];
            break;
          }
          j--;
        }
        if (finded === null) return -1;
        return finded;
      }
      return -2;
    } else {
      throw Error("Error: No puedes buscar en una collección nula");
    }
  }

  async findAll<T>(
    callback: (condition: T, index?: number | undefined) => unknown,
  ): Promise<T | unknown> {
    const ref = doc(firestore, this.dbname, this.subcat);
    const collection = await getDoc(ref);
    if (collection !== null) {
      if (collection.exists()) {
        const data = collection.data();
        const finding = data.data as Array<T>;
        let j = finding.length - 1;
        let finded = [];
        for (let i = 0; i < Math.floor(finding.length / 2); i++) {
          if (callback(finding[i], i) === true) {
            finded.push(finding[i]);
          }
          if (callback(finding[j], j) === true) {
            finded.push(finding[j]);
          }
          j--;
        }
        if (finded === null) return -1;
        return finded;
      }
      return -2;
    } else {
      throw Error("Error: No puedes buscar en una collección nula");
    }
  }
}

export default FirestoreController;

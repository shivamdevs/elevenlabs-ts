import { v4 as uuid } from "uuid";

export default uuid;

export const uuidName = (timestamp?: boolean) => {
    const id = uuid();

    return timestamp ? `${Date.now()}-${id}` : id;
};

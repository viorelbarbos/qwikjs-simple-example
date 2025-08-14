declare global {
  type devStore = {
    developers: Developer[];
  };

  type Developer = {
    id: string;
    name: string;
    isJunior: boolean;
    frameworks: {
      name: string;
    }[];
  };
}

export {};

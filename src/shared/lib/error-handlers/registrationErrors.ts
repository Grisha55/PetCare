export interface PostgrestError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

export const isPostgrestError = (err: unknown): err is PostgrestError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err
  );
};

export const isError = (err: unknown): err is Error => {
  return err instanceof Error;
};

export const getRegistrationErrorMessage = (error: unknown): string => {
  if (isPostgrestError(error) && error.code === '23505') {
    return 'У вас уже есть питомец. Вы можете добавить ещё одного в настройках.';
  } else if (
    isPostgrestError(error) &&
    error.message.includes('duplicate key')
  ) {
    return 'У вас уже есть питомец. Вы можете добавить ещё одного в настройках.';
  } else if (isError(error)) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Registration error';
  }
};
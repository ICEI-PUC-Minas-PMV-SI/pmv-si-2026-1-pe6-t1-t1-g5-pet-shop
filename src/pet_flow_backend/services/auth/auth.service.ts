import { AuthRepository } from "./repositories/auth.repository";
import { Auth } from "./domain/models/auth";
import { DbResult } from "../../shared/utils/supabase.extensions";
import { ClinicService } from "../clinic/clinic.service";
import { EmployeeService } from "../employee/employee.service";

export interface RegisterInput {
  email: string;
  password: string;
  clinicName: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  ownerName: string;
  cpf?: string;
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly clinicService: ClinicService,
    private readonly employeeService: EmployeeService,
  ) {}

  async login(email: string, password: string): Promise<DbResult<Auth>> {
    return this.repository.login(email, password);
  }

  async register(input: RegisterInput): Promise<DbResult<Auth>> {
    const { data: auth, error } = await this.repository.register(
      input.email,
      input.password,
    );
    if (error) return { data: null, error };
    if (!auth) return { data: null, error: null };

    // Provisiona a clínica para o novo dono.
    let clinicId: string | undefined;
    try {
      const clinic = await this.clinicService.createClinic({
        name: input.clinicName,
        cnpj: input.cnpj,
        address: input.address,
        phone: input.phone,
        email: input.email,
      });
      clinicId = clinic.id;
    } catch (err) {
      console.error("[AuthService] failed to create clinic on register:", err);
      throw new Error(
        "Conta criada, mas não foi possível cadastrar a clínica.",
        { cause: err },
      );
    }

    // Cria o funcionário responsável (dono) vinculado à clínica.
    try {
      await this.employeeService.createEmployee({
        name: input.ownerName,
        cpf: input.cpf,
        address: input.address,
        phone: input.phone,
        email: input.email,
        role: "dono",
        clinicId,
      });
    } catch (err) {
      console.error("[AuthService] failed to create owner on register:", err);
      // Rollback da clínica para não deixar registro órfão.
      if (clinicId) {
        await this.clinicService
          .deleteClinic(clinicId)
          .catch((e) =>
            console.error("[AuthService] clinic rollback failed:", e),
          );
      }
      throw new Error("Não foi possível cadastrar o usuário responsável.", {
        cause: err,
      });
    }

    return {
      data: new Auth(auth.userId, auth.token, auth.refreshToken, clinicId),
      error: null,
    };
  }

  async refresh(refreshToken: string): Promise<DbResult<Auth>> {
    return this.repository.refresh(refreshToken);
  }
}

import { AuthServiceController, AuthServiceControllerMethods, LoginRequest, RegisterRequest } from "@app/common/types/auth";
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
    constructor(private readonly authService: AuthService) { }

    register(registerRequest: RegisterRequest) {
        return this.authService.register(registerRequest);
    }

    login(loginRequest: LoginRequest) {
        return this.authService.login(loginRequest);
    }


}
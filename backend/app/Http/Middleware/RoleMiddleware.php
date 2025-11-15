<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {   //Ovo ti daje trenutno ulogovanog korisnika
        $user = $request->user();

        if (!$user) {
            // Nije ulogovan nema token
            return response()->json(['message' => 'Unauthorized'], 401);
        }
         //$roles je lista uloga koje si definisao na ruti u middlewaru
        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        //Ako sve okej — prosledi request dalje
        return $next($request);
    }
}
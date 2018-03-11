# polar-prime-spiral

Generates a spiral of primes based on Sergey Porshnev's paper "On the issues of prime numbers' and twin primes' distribution on the Ulam spiral".

https://cloudofscience.ru/sites/default/files/pdf/CoS_4_593.pdf

Given the first N primes `P_i`, `i=1..N`, each plotted point has the coordinates:

`x = P_i * cos(i)
y = P_i * sin(i)`

Angle `i` can be modified by a period factor, resulting in a different number of spirals.

Optionally, use the first N natural numbers instead of all primes less than or equal to N.

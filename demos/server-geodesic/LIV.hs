
{-# OPTIONS -Wall #-}

{-# Language 
    DataKinds,
    PolyKinds, 
    GADTs, 
    FlexibleInstances, 
    FlexibleContexts, 
    TypeFamilies #-}

module LIV where

import Prelude hiding 
       (foldr, length, head, last, tail, 
       init, take, drop, lookup, (++), zipWith, 
       foldl, foldr, iterate, map)

import qualified Data.Foldable as DF (Foldable, foldr)
import Nat

-- | Length-Indexed Vectors, annotated at the type level using natural numbers

data LIV :: N -> * -> * where
  Nil :: LIV Z a
  Cons :: a -> LIV n a -> LIV (S n) a

-- | Common type classes

instance Eq (LIV Z a) where
  Nil == Nil = True

instance (Eq a, Eq (LIV n a)) => Eq (LIV (S n) a) where
  Cons x xs == Cons y ys = x == y && xs == ys 

instance Show a => Show (LIV n a) where
  show = show.unLIV

-- | Annotation type classes

-- | Common functions

length :: LIV n a -> Int
length = intVal.lengthN

lengthN :: LIV n a -> Nat n
lengthN Nil         = Ze
lengthN (Cons _ xs) = Su $ lengthN xs

unLIV :: LIV n a -> [a]
unLIV Nil         = []
unLIV (Cons x xs) = x : unLIV xs

null :: LIV Z a -> Bool
null Nil = True

(!) :: LT (LT_N n1 n2) => LIV n2 a -> Nat n1 -> a
(!) = lookup lt where
  lookup :: LT_N n1 n2 -> LIV n2 a -> Nat n1 -> a
  lookup _ Nil _ = restricted
  lookup LT_Z (Cons x _) Ze = x
  lookup LT_Z _ _ = restricted
  lookup (LT_S ltn) (Cons _ xs) (Su n) = lookup ltn xs n
  lookup (LT_S _) (Cons _ _) _ = restricted

replace :: LT (LT_N n1 n2) => Nat n1 -> a -> LIV n2 a -> LIV n2 a
replace = replace' lt where
  replace' :: LT_N n1 n2 -> Nat n1 -> a -> LIV n2 a -> LIV n2 a
  replace' _ _ _ Nil = restricted
  replace' LT_Z Ze x (Cons _ ys) = Cons x ys
  replace' LT_Z _ _ _ = restricted
  replace' (LT_S ltn) (Su n) x (Cons y ys) = Cons y $ replace' ltn n x ys
  replace' (LT_S _) _ _ _ = restricted

head :: LIV (S n) a -> a
head (Cons x _) = x

last :: LIV (S n) a -> a
last (Cons x Nil) = x
last (Cons _ xs@(Cons _ _)) = last xs

tail :: LIV (S n) a -> LIV n a
tail (Cons _ xs) = xs

init :: LIV (S n) a -> LIV n a
init (Cons _ Nil) = Nil
init (Cons x xs@(Cons _ _)) = Cons x $ init xs

take :: LT (LT_N n1 (S n2)) => Nat n1 -> LIV n2 a -> LIV n1 a
take = take' lt where
  take' :: LT_N n1 (S n2) -> Nat n1 -> LIV n2 a -> LIV n1 a
  take' LT_Z Ze _ = Nil
  take' LT_Z _ _ = restricted
  take' (LT_S ltn) (Su n) (Cons x xs) = Cons x $ take' ltn n xs
  take' (LT_S _) _ _ = restricted

drop :: LT (LT_N n1 (S n2)) => Nat n1 -> LIV n2 a -> LIV (SUB n2 n1) a
drop = drop' lt where
  drop' :: LT_N n1 (S n2) -> Nat n1 -> LIV n2 a -> LIV (SUB n2 n1) a
  drop' LT_Z Ze liv = liv
  drop' LT_Z _ _ = restricted
  drop' (LT_S ltn) (Su n) (Cons _ xs) = drop' ltn n xs
  drop' (LT_S _) _ _ = restricted

select :: LT (LT_N (ADD n1 n2) (S n3)) => Nat n1 -> Nat n2 -> LIV n3 a -> LIV n2 a
select = select' lt where
  select' :: LT_N (ADD n1 n2) (S n3) -> Nat n1 -> Nat n2 -> LIV n3 a -> LIV n2 a
  select' LT_Z Ze Ze _ = Nil
  select' LT_Z _ _ _ = restricted
  select' (LT_S ltn) (Su n1) n2 (Cons _ xs) = select' ltn n1 n2 xs
  select' (LT_S ltn) Ze (Su n) (Cons x xs) = Cons x $ select' ltn Ze n xs
  select' (LT_S _) _ _ _ = restricted

newtype FlipLIV a n = FlipLIV { unFlip :: LIV n a }

(++) :: LIV n1 a -> LIV n2 a -> LIV (ADD n1 n2) a
(++) Nil ys = ys
(++) (Cons x xs) ys = Cons x $ xs ++ ys

instance MonoidA (FlipLIV a) where
  mempty = FlipLIV Nil
  mappend a b = FlipLIV $ (unFlip a) ++ (unFlip b)

map :: (a -> b) -> LIV n a -> LIV n b
map _ Nil = Nil
map f (Cons x xs) = Cons (f x) (fmap f xs)

zipWith :: (a -> b -> c) -> LIV n a -> LIV n b -> LIV n c
zipWith _ Nil Nil = Nil
zipWith f (Cons x xs) (Cons y ys) = Cons (f x y) $ zipWith f xs ys
zipWith _ _ _ = restricted

foldl :: a -> (a -> b -> a) -> LIV n b -> a
foldl z _ Nil = z
foldl z f (Cons x xs) = foldl (f z x) f xs

foldr :: (a -> b -> b) -> b -> LIV n a -> b
foldr _ z Nil = z
foldr f z (Cons x xs) = f x $ foldr f z xs

zip :: LIV n a -> LIV n b -> LIV n (a,b)
zip = zipWith (,)

-- filter cannot be defined

iterate :: Nat n -> (a -> a) -> a -> LIV n a
iterate Ze _ _  = Nil
iterate (Su n) f x = Cons x (iterate n f (f x))

copy :: Nat n -> a -> LIV n a
copy Ze _ = Nil
copy (Su n) x = Cons x $ copy n x

-- | Instances

instance DF.Foldable (LIV n) where
  foldr = foldr

instance Functor (LIV n) where
  fmap = map

-- | Finite Series

class MakeNats n where
  makeNats :: LIV n Int

instance MakeNats Z where
  makeNats = Nil
  
instance (MakeNats n) => MakeNats (S n) where
  makeNats = Cons 0 (fmap (+1) makeNats)
  
class Fillable n where  
  fill :: a -> LIV n a

instance Fillable Z where
  fill = const Nil
  
instance Fillable n => Fillable (S n) where
  fill x = Cons x (fill x)

lengthError :: a
lengthError = error "unlike lengths"

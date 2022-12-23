const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get('models');
  const profileId = req.get('profile_id') || 0;
  const profile = await Profile.getById(profileId);
  if (!profile) return res.status(401).json({ message: 'Profile not found' });

  req.app.set('profile', profile);
  next();
}
module.exports = { getProfile };

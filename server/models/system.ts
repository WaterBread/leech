import checkDiskSpace from 'check-disk-space';

export const getUsedDiskSpaceSummary = async () => {
  const diskspace = await checkDiskSpace('/');

  const usedSize = diskspace.size - diskspace.free;

  return {
    freeBytes: diskspace.free,
    usedBytes: usedSize,
    totalBytes: diskspace.size,
    percentageUsed: (usedSize / diskspace.size) * 100
  };
};
